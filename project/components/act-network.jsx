/* ACT 4 — CODA NETWORK
   A D3 force-directed graph of how coda types follow each other in
   recorded sequences. Each node is a coda type; each link is a
   transition weighted by frequency. Color by clan. Click a node to play. */

function CodaForceGraph({ data, onNodeClick, hovered, setHovered, selected }) {
  const wrapRef = useRef(null);
  const size = useSize(wrapRef);
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const nodesRef = useRef(null);
  const linksRef = useRef(null);

  // Initialize once
  useEffect(() => {
    if (!svgRef.current) return;
    const W = size.w, H = 540;
    if (!W) return;

    const svg = d3.select(svgRef.current);
    svg.attr('viewBox', `0 0 ${W} ${H}`).attr('width', W).attr('height', H);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');
    // Marker for directed arrows
    ['EC1','EC2'].forEach((clan, i) => {
      const c = clan === 'EC1' ? '#4afdc6' : '#c6ffe6';
      defs.append('marker')
        .attr('id', 'arrow-' + clan)
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 18).attr('refY', 5)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 Z').attr('fill', c).attr('opacity', 0.55);
    });

    // copy of data — d3 mutates
    const nodes = data.nodes.map(n => ({ ...n }));
    const links = data.links.map(l => ({ ...l }));

    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => 160 - d.w * 6).strength(0.4))
      .force('charge', d3.forceManyBody().strength(-380))
      .force('center', d3.forceCenter(W/2, H/2))
      .force('collide', d3.forceCollide(46))
      .alphaDecay(0.025);
    simRef.current = sim;

    const linkSel = svg.append('g').selectAll('path').data(links).enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', d => d.source.clan === 'EC1' ? '#4afdc6' : '#c6ffe6')
      .attr('stroke-opacity', 0.35)
      .attr('stroke-width', d => 0.7 + d.w * 0.4)
      .attr('marker-end', d => `url(#arrow-${d.source.clan || 'EC1'})`);
    linksRef.current = linkSel;

    const nodeG = svg.append('g').selectAll('g').data(nodes).enter().append('g')
      .style('cursor', 'pointer')
      .on('click', (e, d) => onNodeClick && onNodeClick(d))
      .on('mouseenter', (e, d) => setHovered(d.id))
      .on('mouseleave', () => setHovered(null))
      .call(d3.drag()
        .on('start', (event, d) => { if (!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on('drag',  (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end',   (event, d) => { if (!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

    nodeG.append('circle')
      .attr('class', 'halo')
      .attr('r', 32)
      .attr('fill', d => d.clan === 'EC1' ? '#4afdc6' : '#c6ffe6')
      .attr('opacity', 0.06);

    nodeG.append('circle')
      .attr('class', 'node-fill')
      .attr('r', 22)
      .attr('fill', '#03060f')
      .attr('stroke', d => d.clan === 'EC1' ? '#4afdc6' : '#c6ffe6')
      .attr('stroke-width', 1.3);

    // Inside each node, draw mini-tick pattern of clicks
    nodeG.each(function(d) {
      const g = d3.select(this);
      const ivs = d.intervals;
      const total = ivs.reduce((s,v)=>s+v,0);
      const n = ivs.length + 1;
      const w = 28;
      let acc = 0;
      const xs = [acc];
      for (const v of ivs) { acc += v; xs.push(acc); }
      const tx = (t) => -w/2 + (t / total) * w;
      const tg = g.append('g');
      xs.forEach((t, i) => {
        tg.append('line')
          .attr('x1', tx(t)).attr('x2', tx(t))
          .attr('y1', -7).attr('y2', 7)
          .attr('stroke', '#c6ffe6').attr('stroke-width', 1.3)
          .attr('opacity', 0.85);
      });
    });

    nodeG.append('text')
      .attr('y', 38).attr('text-anchor', 'middle')
      .attr('fill', '#eef3fa')
      .attr('font-family', 'IBM Plex Mono').attr('font-size', 11)
      .text(d => d.id);

    nodesRef.current = nodeG;

    sim.on('tick', () => {
      linkSel.attr('d', d => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx*dx + dy*dy) * 2.4;
        return `M${d.source.x},${d.source.y} A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });
      nodeG.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    return () => sim.stop();
  }, [size.w, data]);

  // Hover and selection styling
  useEffect(() => {
    if (!nodesRef.current || !linksRef.current) return;
    nodesRef.current.select('.node-fill')
      .transition().duration(200)
      .attr('stroke-width', d => (d.id === hovered || d.id === selected) ? 2.8 : 1.3)
      .style('filter', d => (d.id === hovered || d.id === selected) ? `drop-shadow(0 0 14px ${d.clan === 'EC1' ? '#4afdc6' : '#c6ffe6'})` : 'none');
    nodesRef.current.select('.halo')
      .transition().duration(200)
      .attr('opacity', d => (d.id === hovered || d.id === selected) ? 0.22 : 0.06);
    linksRef.current
      .transition().duration(200)
      .attr('stroke-opacity', d => {
        const h = hovered || selected;
        if (!h) return 0.35;
        if (d.source.id === h || d.target.id === h) return 0.95;
        return 0.08;
      });
  }, [hovered, selected]);

  return <div ref={wrapRef}><svg ref={svgRef}/></div>;
}

function ActNetwork() {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  const play = useCallback((d) => {
    setSelected(d.id);
    if (!window.WhaleAudio) return;
    window.WhaleAudio.resume();
    window.WhaleAudio.playCoda(d.intervals);
    setTimeout(() => setSelected(null), 2000);
  }, []);

  return (
    <section id="network" className="act" data-screen-label="05 Combinatorics">
      <div className="col-xwide">
        <Eyebrow num={4}>Sequence statistics</Eyebrow>
        <h2>What follows what.</h2>
        <p className="lede" style={{ maxWidth: '46ch' }}>
          Codas are not uttered in isolation. When two whales talk, they exchange.
          Trace any node to its outgoing edges — those are the codas that statistically follow it.
        </p>

        <div className="split-aside" style={{ marginTop: 32 }}>
          <div className="panel panel--lumen" style={{ padding: 8 }}>
            <span className="corner mono">FIG. 02 · transition graph (illustrative)</span>
            <CodaForceGraph data={CODA_NET} onNodeClick={play}
              hovered={hovered} setHovered={setHovered} selected={selected}/>
          </div>
          <div>
            <div style={{ marginBottom: 24 }}>
              <Chip active><span className="dot" style={{ background:'#4afdc6' }}></span>Clan&nbsp;EC1</Chip>{' '}
              <Chip active><span className="dot" style={{ background:'#c6ffe6' }}></span>Clan&nbsp;EC2</Chip>
            </div>
            <p style={{ fontSize: 15, color: 'var(--mist)', maxWidth: '32ch' }}>
              Sperm whales live in matrilineal units, which gather into <em>clans</em>.
              Each clan has a distinct coda repertoire — like a regional accent — and shares it across thousands of kilometres of ocean.
              <br/><br/>
              Two clans, EC1 and EC2, share part of the eastern Caribbean. They overlap geographically but not vocally.
            </p>
            <p className="small" style={{ marginTop: 16, color: 'var(--shoal)' }}>
              Drag a node to rearrange. Click to play.
            </p>
            {selected && (
              <div className="specimen" style={{ marginTop: 16 }}>
                <span className="latin">Now playing</span>
                <span className="name">{selected}</span>
              </div>
            )}
          </div>
        </div>

        <p style={{ marginTop: 64, maxWidth: '62ch', color: 'var(--foam)' }}>
          The deeper question is whether these transitions are <em>productive</em> — generative — or just <em>habitual</em>.
          A bird&apos;s alarm call follows context, not grammar. A sentence follows grammar. The same statistical
          methods that distinguish a Markov chain from a context-free grammar are now being applied to whale sequence data, but the
          sample sizes are still small. The CETI corpus, the largest ever assembled for sperm whales, contains only about
          nine thousand coda exchanges.
        </p>
      </div>
    </section>
  );
}

window.ActNetwork = ActNetwork;
