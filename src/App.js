import { useState, useCallback, useRef } from 'react'
import { produce, produceWithPatches } from 'immer'

const nRows = 50;
const nCols = 50;
const operations = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1]
]
function App() {
  const [grid, setGrid] = useState(() => {
    const rows = []
    for (let i = 0; i < nRows; i++) {
      rows.push(Array.from(Array(nCols), () => 0))
    }
    return rows
  })

  const [running, setRunning] = useState(false)
  const runningRef = useRef(running)
  runningRef.current = running

  const toggleRunning = () => {
    setRunning(!running)
  }
  const runSimulation = useCallback(
    () => {
      if (!runningRef.current) {
        return;
      }
      setGrid((currentGrid) => {
        return produce(currentGrid, gridCopy => {
          for (let i = 0; i < nRows; i++) {
            for (let j = 0; j < nCols; j++) {
              let neighbors = 0;
              operations.forEach(([x, y]) => {
                let newI = i + x;
                let newJ = j + y;
                if (newI < 0) {
                  newI = nRows - 1;
                }
                if (newJ < 0) {
                  newJ = nCols - 1;
                }
                if (newI >= nRows) {
                  newI = 0
                }
                if (newJ >= nCols) {
                  newJ = 0
                }
                neighbors += currentGrid[newI][newJ]
              })
              if (neighbors < 2 || neighbors > 3) {
                gridCopy[i][j] = 0;
              } else if (neighbors === 3) {
                gridCopy[i][j] = 1;
              }
            }
          }
        })
      })

      setTimeout(runSimulation, 100);
    },
    []
  )


  return (
    <>
      <button
        onClick={() => {
          toggleRunning()
          if (!running) {
            runningRef.current = true;
            runSimulation()
          }
        }}>
        {running ? 'Stop' : 'Start'}
      </button>
      <button
        onClick={() => {
          setGrid((currentGrid) => {
            return produce(currentGrid, gridCopy => {
              for (let i = 0; i < nRows; i++) {
                for (let j = 0; j < nCols; j++) {
                  gridCopy[i][j] = 0;
                }
              }
            })
          })
        }}>Clear</button>
      <button
        onClick={() => {
          setGrid((currentGrid) => {
            return produce(currentGrid, gridCopy => {
              for (let i = 0; i < nRows; i++) {
                for (let j = 0; j < nCols; j++) {
                  gridCopy[i][j] = Math.random() > 0.5 ? 1 : 0
                }
              }
            })
          })
        }
        }
      >Random</button>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${nCols}, 20px)`
        }}>

        {grid.map((rows, rowIndex) => rows.map((col, colIndex) =>
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => {
              const newGrid = produce(grid, gridCopy => {
                gridCopy[rowIndex][colIndex] = gridCopy[rowIndex][colIndex] === 1 ? 0 : 1
              })
              setGrid(newGrid)
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[rowIndex][colIndex] ? 'pink' : undefined,
              border: 'solid 1px black'
            }} />
        ))}
      </div>
    </>
  );
}

export default App;
