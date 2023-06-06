export default class Graph {
    adjacencyList: {};
    constructor() {
      this.adjacencyList = {};
    }
    addVertex(vertex: string | number) {
      if (!this.adjacencyList[vertex]) {
        this.adjacencyList[vertex] = [];
      }
    }
    addEdge(source: string | number, destination: string | number) {
      if (!this.adjacencyList[source]) {
        this.addVertex(source);
      }
      if (!this.adjacencyList[destination]) {
        this.addVertex(destination);
      }
      this.adjacencyList[source].push(destination);
      this.adjacencyList[destination].push(source);
    }
    removeEdge(source: string | number, destination: string | number) {
      this.adjacencyList[source] = this.adjacencyList[source].filter(vertex => vertex !== destination);
      this.adjacencyList[destination] = this.adjacencyList[destination].filter(vertex => vertex !== source);
    }
    removeVertex(vertex: string | number) {
      while (this.adjacencyList[vertex]) {
        const adjacentVertex = this.adjacencyList[vertex].pop();
        this.removeEdge(vertex, adjacentVertex);
      }
      delete this.adjacencyList[vertex];
    } 
    
    bfs(start: string | number) {
      const queue = [start];
      const result = [];
      const visited = {};
      visited[start] = true;
      let currentVertex;
      while (queue.length) {
        currentVertex = queue.shift();
        result.push(currentVertex);
        this.adjacencyList[currentVertex].forEach(neighbor => {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
          }
        });
      }
      return result;
  }
}

//   Graph.prototype.bfs = function
// Graph.prototype.dfsRecursive = function
// Graph.prototype.dfsIterative = function(start) {
//     const result = [];
//     const stack = [start];
//     const visited = {};
//     visited[start] = true;
//     let currentVertex;
//     while (stack.length) {
//       currentVertex = stack.pop();
//       result.push(currentVertex);
//       this.adjacencyList[currentVertex].forEach(neighbor => {
//         if (!visited[neighbor]) {
//           visited[neighbor] = true;
//           stack.push(neighbor);
//         }
//       });
//     }
//     return result;
// }