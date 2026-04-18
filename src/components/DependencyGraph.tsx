import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { DependencyNode, DependencyLink } from '../types';

interface Props {
  data: {
    nodes: DependencyNode[];
    links: DependencyLink[];
  };
}

export const DependencyGraph = ({ data }: Props) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const width = svgRef.current.clientWidth;
    const height = 400;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Sanitize data: filter links that reference missing nodes
    const nodeIds = new Set(data.nodes.map(n => n.id));
    const validLinks = data.links.filter(l => 
      nodeIds.has(typeof l.source === 'string' ? l.source : (l.source as any).id) && 
      nodeIds.has(typeof l.target === 'string' ? l.target : (l.target as any).id)
    );

    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(validLinks).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "rgba(255,255,255,0.1)")
      .attr("stroke-width", 2)
      .selectAll("line")
      .data(validLinks)
      .join("line");

    const node = svg.append("g")
      .selectAll("g")
      .data(data.nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    node.append("circle")
      .attr("r", 12)
      .attr("fill", (d: any) => {
        if (d.risk === 'High') return '#ef4444';
        if (d.risk === 'Medium') return '#f59e0b';
        if (d.risk === 'Low') return '#00E5FF';
        return '#22c55e';
      })
      .attr("stroke", "rgba(0,0,0,0.5)")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d: any) => d.id)
      .attr("x", 18)
      .attr("y", 5)
      .attr("fill", "white")
      .attr("font-size", "10px")
      .attr("font-weight", "800")
      .attr("class", "uppercase tracking-widest");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [data]);

  return (
    <div className="w-full bg-black/40 rounded-3xl border border-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
         <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-cyber-blue">Contract Dependency Engine</h4>
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-red-500" />
               <span className="text-[8px] font-black uppercase text-text-dim tracking-widest">Entry Node</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-cyber-blue" />
               <span className="text-[8px] font-black uppercase text-text-dim tracking-widest">Secure Node</span>
            </div>
         </div>
      </div>
      <svg ref={svgRef} className="w-full h-[400px]" />
    </div>
  );
};
