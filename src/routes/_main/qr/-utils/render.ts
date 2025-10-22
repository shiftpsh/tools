const dx = [0, 1, 0, -1]
const dy = [1, 0, -1, 0]
const bx1 = [0, 1, 0, 0]
const bx2 = [1, 1, 1, 0]
const by1 = [1, 0, 0, 0]
const by2 = [1, 1, 0, 1]

const pathArea = (path: [number, number][]) => {
  let area = 0
  const len = path.length
  for (let i = 0; i < len; i++) {
    const [x1, y1] = path[i]
    const [x2, y2] = path[(i + 1) % len]
    area += x1 * y2 - x2 * y1
  }
  return Math.abs(area) / 2
}

interface Options {
  compoundPath?: boolean
  centerBlankSize?: number
}

export const convertToPaths = (
  n: number,
  data: Uint8Array<ArrayBufferLike>,
  options: Options = {},
) => {
  const { compoundPath = true, centerBlankSize = 0 } = options
  const copiedData = new Uint8Array(data)

  const m = n + 1

  // Clear center blank area
  if (centerBlankSize > 0) {
    const start = Math.floor((n - centerBlankSize) / 2)
    const end = start + centerBlankSize
    for (let x = start; x < end; x++) {
      for (let y = start; y < end; y++) {
        copiedData[x * n + y] = 0
      }
    }
  }

  // Find connected components
  const visited = new Set<number>()
  const components: number[][] = []

  const dfs = (u: number, component: number[]) => {
    for (let d = 0; d < 4; d++) {
      const nx = Math.floor(u / n) + dx[d]
      const ny = (u % n) + dy[d]
      if (nx >= 0 && ny >= 0 && nx < n && ny < n) {
        const v = nx * n + ny
        if (!visited.has(v) && copiedData[v]) {
          visited.add(v)
          component.push(v)
          dfs(v, component)
        }
      }
    }
  }

  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      const u = x * n + y
      if (copiedData[u] && !visited.has(u)) {
        visited.add(u)
        const component = [u]
        dfs(u, component)
        components.push(component)
      }
    }
  }

  // Outline the components
  const outlines = components.map((component) => {
    const edges: [number, number][] = []

    component.forEach((u) => {
      const x = Math.floor(u / n)
      const y = u % n
      for (let d = 0; d < 4; d++) {
        const nx = x + dx[d]
        const ny = y + dy[d]
        if (
          nx < 0 ||
          ny < 0 ||
          nx >= n ||
          ny >= n ||
          !copiedData[nx * n + ny]
        ) {
          const bxStart = x + bx1[d]
          const byStart = y + by1[d]
          const bxEnd = x + bx2[d]
          const byEnd = y + by2[d]
          edges.push([bxStart * m + byStart, bxEnd * m + byEnd])
        }
      }
    })

    // Build paths from boundary edges
    const edgeGraph = new Map<number, number[]>()
    edges.forEach(([start, end]) => {
      if (!edgeGraph.has(start)) {
        edgeGraph.set(start, [])
      }
      if (!edgeGraph.has(end)) {
        edgeGraph.set(end, [])
      }
      edgeGraph.get(start)!.push(end)
      edgeGraph.get(end)!.push(start)
    })

    const paths: number[][] = []
    const usedEdges = new Set<string>()

    edges.forEach(([start, end]) => {
      const edgeKey = `${start},${end}`
      if (usedEdges.has(edgeKey) || usedEdges.has(`${end},${start}`)) return
      usedEdges.add(edgeKey)

      const path: number[] = [start, end]
      let u = end

      while (true) {
        const adj = (edgeGraph.get(u) || []).filter((v) => {
          if (usedEdges.has(`${u},${v}`)) return false
          if (usedEdges.has(`${v},${u}`)) return false
          return true
        })
        if (!adj.length) break

        const v =
          adj.find((v) => {
            const px = Math.floor(path[path.length - 2] / m)
            const py = path[path.length - 2] % m
            const ux = Math.floor(u / m)
            const uy = u % m
            const vx = Math.floor(v / m)
            const vy = v % m

            const dot = (ux - px) * (vx - ux) + (uy - py) * (vy - uy)
            return dot === 0
          }) || adj[0]

        usedEdges.add(`${u},${v}`)
        path.push(v)
        u = v
      }
      path.pop() // Remove duplicate start/end point
      paths.push(path)
    })

    // Convert paths to SVG path data
    // Simplify the path by removing collinear points
    const simplifiedPaths = paths.map((path) => {
      const simplified: number[] = []
      const len = path.length
      for (let i = 0; i < len; i++) {
        const prev = path[(i - 1 + len) % len]
        const curr = path[i]
        const next = path[(i + 1) % len]

        const px = Math.floor(prev / m)
        const py = prev % m
        const cx = Math.floor(curr / m)
        const cy = curr % m
        const nx = Math.floor(next / m)
        const ny = next % m

        const v1x = cx - px
        const v1y = cy - py
        const v2x = nx - cx
        const v2y = ny - cy

        const cross = v1x * v2y - v1y * v2x
        if (cross !== 0) {
          simplified.push(curr)
        }
      }
      return simplified
    })

    // Normalize winding rule
    // Ensure outer paths are clockwise and holes are counter-clockwise
    // This is generally hard, but for QR codes we can safely assume
    // that the largest area path is the outer path
    const areas = simplifiedPaths.map((path) =>
      pathArea(
        path.map((p) => {
          const x = Math.floor(p / m)
          const y = p % m
          return [x, y] as [number, number]
        }),
      ),
    )
    const maxAreaIndex = areas.indexOf(Math.max(...areas))

    simplifiedPaths.forEach((path, index) => {
      const isOuter = index === maxAreaIndex
      const shouldBeClockwise = isOuter

      // Calculate current winding
      let winding = 0
      const len = path.length
      for (let i = 0; i < len; i++) {
        const [x1, y1] = [Math.floor(path[i] / m), path[i] % m]
        const [x2, y2] = [
          Math.floor(path[(i + 1) % len] / m),
          path[(i + 1) % len] % m,
        ]
        winding += (x2 - x1) * (y2 + y1)
      } // Positive winding means clockwise

      const isClockwise = winding > 0
      if (isClockwise !== shouldBeClockwise) {
        path.reverse()
      }
    })

    return simplifiedPaths.map((path) =>
      path.map((p) => [Math.floor(p / m), p % m]),
    )
  })

  const svgPathDefinitions = (compoundPath ? [outlines.flat()] : outlines).map(
    (paths) =>
      paths
        .map((path) => {
          return (
            'M' +
            path
              .map((p) => {
                const x = Math.floor(p[0])
                const y = p[1]
                return `${x},${y}`
              })
              .join('L') +
            'Z'
          )
        })
        .join(' '),
  )

  return [
    `<svg viewBox="0 0 ${n} ${n}" xmlns="http://www.w3.org/2000/svg">`,
    '<g>',
    ...svgPathDefinitions.map((d) => `<path fill="black" d="${d}" />`),
    '</g>',
    `</svg>`,
  ].join('\n')
}
