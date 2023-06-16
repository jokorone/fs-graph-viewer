import { useState } from "react";
import { Node } from "./bindings/Node";
import { ImportFromFs } from "./features/ImportFromFs";
import PixiCanvas, { MemoizedPixiCanvas } from "./features/PixiCanvas";
import FolderTree from "./features/FolderTree";
import { RawGraphLink, RawGraphModel, RawGraphNode } from "./lib/d3/model";
import Button from "./components/Button";

import miserables from './assets/miserables.json';

// import "./App.css";

function App() {
  const [files, setFiles] = useState<Node[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`flex flex-col  bg-gray-200 transition duration-500 ease-in-out ${
          isSidebarOpen ? 'w-16' : 'w-64'
        }`}
      >
        {/* Sidebar content */}
        {/* Add your sidebar content here */}
        <Button
          size="medium"
          variant="secondary"
          onClick={toggleSidebar}
        >
          { isSidebarOpen ? 'Close' : 'Open' }
        </Button>
        <ImportFromFs callback={setFiles}/>

        {
           files.length > 0 && <FolderTree rootFolders={files} />
        }
      </div>

      {/* Main section */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        {/* Add your header component here */}

        {/* Content */}
        <main className="flex-grow p-4">
          {
            // files.length > 0 && <>
            //   <MemoizedPixiCanvas data={convertModelToResult(files[0])}></MemoizedPixiCanvas>
            // </>

            <MemoizedPixiCanvas data={miserables} />
          }
        </main>
      </div>
    </div>
  );
}

export default App;


function convertModelToResult(originalModel: Node): RawGraphModel {
  const nodes: RawGraphNode[] = [];
  const links: RawGraphLink[] = [];

  function traverse(node: Node) {
    // Add the current node to the nodes array
    nodes.push({
      id: node.path,
      payload: node,
    });

    // Traverse the children of the current node
    for (const child of node.children) {
      traverse(child);

      nodes.push({
        id: child.path,
        payload: child,
      });

      // Add a link from the current node to the child
      links.push({
        source: node.path,
        target: child.path,
      });
    }

    // Traverse the leafs of the current node
    for (const leaf of node.leafs) {
      nodes.push({
        id: leaf.path,
        payload: leaf,
      });

      // Add a link from the current node to the leaf
      links.push({
        source: node.path,
        target: leaf.path,
      });
    }
  }

  // Start the traversal from the root node
  traverse(originalModel);

  return { nodes, links };
}
