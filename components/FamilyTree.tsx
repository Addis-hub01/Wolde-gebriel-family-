import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { FamilyMember } from '../types';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface FamilyTreeProps {
  members: FamilyMember[];
  onSelectMember: (member: FamilyMember) => void;
}

export const FamilyTree: React.FC<FamilyTreeProps> = ({ members, onSelectMember }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Convert flat list to hierarchy
  const hierarchyData = useMemo(() => {
    if (members.length === 0) return null;
    try {
      const stratify = d3.stratify<FamilyMember>()
        .id(d => d.id)
        .parentId(d => d.parentId);
      return stratify(members);
    } catch (e) {
      console.error("Tree structure invalid", e);
      return null;
    }
  }, [members]);

  // Update dimensions on resize
  useEffect(() => {
    const updateDims = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', updateDims);
    updateDims();
    return () => window.removeEventListener('resize', updateDims);
  }, []);

  // Render Tree
  useEffect(() => {
    if (!hierarchyData || !svgRef.current) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    // 1. Create the container group 'g' first so it is available for zoom behavior
    const g = svg.append('g');

    // Layout configuration
    const treeLayout = d3.tree<FamilyMember>()
      .size([width - 100, height - 200])
      .nodeSize([180, 200]); // Width, Height spacing between nodes

    // hierarchyData is already a d3.HierarchyNode<FamilyMember>
    const root = hierarchyData;
    
    // Assign coordinates
    treeLayout(root);

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomLevel(event.transform.k);
      });

    svg.call(zoom);

    // Initial transform to center the tree
    // We want the root node near the top center
    const initialTransform = d3.zoomIdentity.translate(width / 2, 80).scale(0.8);
    svg.call(zoom.transform, initialTransform);

    // Links (Lines)
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#cbd5e1') // slate-300
      .attr('stroke-width', 2)
      .attr('d', d3.linkVertical()
        .x((d: any) => d.x)
        .y((d: any) => d.y) as any
      );

    // Nodes
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node cursor-pointer transition-transform hover:scale-105')
      .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
      .on('click', (event, d) => {
          onSelectMember(d.data); 
      });

    // Node Card Rectangle
    nodes.append('rect')
      .attr('width', 160)
      .attr('height', 80)
      .attr('x', -80)
      .attr('y', -40)
      .attr('rx', 10)
      .attr('fill', 'white')
      .attr('stroke', '#e2e8f0')
      .attr('stroke-width', 1)
      .attr('class', 'shadow-sm filter');

    // Avatar Circle
    nodes.append('defs')
        .append('clipPath')
        .attr('id', d => `clip-${d.id}`)
        .append('circle')
        .attr('r', 24)
        .attr('cx', 0)
        .attr('cy', -24);
        
    nodes.append('image')
        .attr('xlink:href', (d: any) => d.data.photoUrl || 'https://picsum.photos/200')
        .attr('x', -24)
        .attr('y', -48)
        .attr('width', 48)
        .attr('height', 48)
        .attr('clip-path', d => `url(#clip-${d.id})`)
        .attr('preserveAspectRatio', 'xMidYMid slice');

    // Fallback circle if image fails or for styling border
    nodes.append('circle')
      .attr('r', 25)
      .attr('cy', -24)
      .attr('fill', 'none')
      .attr('stroke', (d: any) => d.data.gender === 'male' ? '#3b82f6' : '#ec4899')
      .attr('stroke-width', 2);

    // Text: Name
    nodes.append('text')
      .attr('dy', 15)
      .attr('text-anchor', 'middle')
      .text((d: any) => d.data.firstName)
      .attr('class', 'font-bold text-sm fill-slate-800');
    
    nodes.append('text')
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .text((d: any) => d.data.lastName)
      .attr('class', 'font-medium text-xs fill-slate-600');

  }, [hierarchyData, dimensions, onSelectMember]);

  const handleZoom = (delta: number) => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    // @ts-ignore
    const currentTransform = d3.zoomTransform(svg.node());
    const newScale = Math.max(0.1, Math.min(3, currentTransform.k + delta));
    // @ts-ignore
    svg.transition().duration(300).call(d3.zoom().transform, 
      d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale)
    );
  };

  return (
    <div className="relative w-full h-[600px] bg-slate-100 overflow-hidden rounded-xl border border-slate-200 shadow-inner" ref={containerRef}>
      <svg ref={svgRef} width="100%" height="100%" className="cursor-grab active:cursor-grabbing" />
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 bg-white p-2 rounded-lg shadow-md border border-slate-200">
        <button onClick={() => handleZoom(0.3)} className="p-2 hover:bg-slate-100 rounded-md text-slate-700">
          <ZoomIn size={20} />
        </button>
        <button onClick={() => handleZoom(-0.3)} className="p-2 hover:bg-slate-100 rounded-md text-slate-700">
          <ZoomOut size={20} />
        </button>
        <button onClick={() => {
             if (!svgRef.current || !dimensions) return;
             const svg = d3.select(svgRef.current);
             const { width } = dimensions;
             // @ts-ignore
             svg.transition().duration(750).call(d3.zoom().transform, 
                d3.zoomIdentity.translate(width / 2, 80).scale(0.8)
             );
        }} className="p-2 hover:bg-slate-100 rounded-md text-slate-700">
          <Maximize size={20} />
        </button>
      </div>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-500 shadow-sm border border-slate-200">
        {members.length} Family Members Loaded
      </div>
    </div>
  );
};
