export class Helpers {
  constructor (box2D) {
    this.box2D = box2D;
  }

  /** to replace original C++ operator = */
  copyVec2 = (vec) => {
    const { b2Vec2 } = this.box2D;
    return new b2Vec2(vec.get_x(), vec.get_y());
  }

  /** to replace original C++ operator * (float) */
  scaleVec2 = (vec, scale) => {
    vec.set_x( scale * vec.get_x() );
    vec.set_y( scale * vec.get_y() );
  }

  /** to replace original C++ operator *= (float) */
  scaledVec2 = (vec, scale) => {
    const { b2Vec2 } = this.box2D;
    return new b2Vec2(scale * vec.get_x(), scale * vec.get_y());
  }

  // http://stackoverflow.com/questions/12792486/emscripten-bindings-how-to-create-an-accessible-c-c-array-from-javascript
  createChainShape = (vertices, closedLoop) => {
    const { _malloc, b2Vec2, b2ChainShape, HEAPF32, wrapPointer } = this.box2D;
    const shape = new b2ChainShape();
    const buffer = _malloc(vertices.length * 8);
    let offset = 0;
    for (let i=0;i<vertices.length;i++) {
      HEAPF32[buffer + offset >> 2] = vertices[i].get_x();
      HEAPF32[buffer + (offset + 4) >> 2] = vertices[i].get_y();
      offset += 8;
    }
    const ptr_wrapped = wrapPointer(buffer, b2Vec2);
    if (closedLoop) {
      shape.CreateLoop(ptr_wrapped, vertices.length);
    } else {
      throw new Error('CreateChain API has changed in Box2D 2.4, need to update this')
      // shape.CreateChain(ptr_wrapped, vertices.length);
    }
    return shape;
  }

  createPolygonShape = (vertices) => {
    const { _malloc, b2Vec2, b2PolygonShape, HEAPF32, wrapPointer } = this.box2D;
    const shape = new b2PolygonShape();
    const buffer = _malloc(vertices.length * 8);
    let offset = 0;
    for (let i=0; i<vertices.length; i++) {
      HEAPF32[buffer + offset >> 2] = vertices[i].get_x();
      HEAPF32[buffer + (offset + 4) >> 2] = vertices[i].get_y();
      offset += 8;
    }
    const ptr_wrapped = wrapPointer(buffer, b2Vec2);
    shape.Set(ptr_wrapped, vertices.length);
    return shape;
  }

  createRandomPolygonShape = (radius) => {
    const { b2Vec2 } = this.box2D;
    let numVerts = 3.5 + Math.random() * 5;
    numVerts = numVerts | 0;
    const verts = [];
    for (let i = 0; i < numVerts; i++) {
      const angle = i / numVerts * 360.0 * 0.0174532925199432957;
      verts.push( new b2Vec2( radius * Math.sin(angle), radius * -Math.cos(angle) ) );
    }
    return this.createPolygonShape(verts);
  }
}