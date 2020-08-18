import React from 'react';
import { HeatMap } from '@nivo/heatmap';
const heatmap_colors = ['#edf8e9', '#bae4b3', '#74c476', '#238b45'];

const Heatmap = ({ graphData, tissueList, labelHeight, graphHeight }) => {
	return (
		<div
			style={{
				width: '100%',
				height: graphHeight,
				textAlign: 'center',
				overflowX: 'scroll',
				overflowY: 'hidden'
			}}
		>
			{tissueList.length ? (
				<HeatMap
					data={graphData}
					keys={tissueList.map(t => t.value)}
					colors={heatmap_colors}
					indexBy="Gene"
					margin={{ top: labelHeight, right: 60, bottom: 0, left: 80 }}
					forceSquare={true}
					axisTop={{
						orient: 'top',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: -90
					}}
					height={graphHeight}
					width={tissueList.length * 50 + 100}
					axisRight={null}
					axisBottom={null}
					axisLeft={{
						orient: 'left',
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0
					}}
					cellBorderWidth={1}
					cellBorderColor="rgb(51, 51, 51)"
					labelTextColor="rgb(51, 51, 51)"
					cellHoverOthersOpacity={1}
					cellOpacity={1}
					nanColor="#fff"
					cellShape={({
						data,
						value,
						x,
						y,
						width,
						height,
						color,
						opacity,
						borderWidth,
						borderColor,
						enableLabel,
						textColor,
						onHover,
						onLeave,
						onClick,
						theme
					}) => {
						return (
							<g
								transform={`translate(${x}, ${y})`}
								onMouseEnter={onHover}
								onMouseMove={onHover}
								onMouseLeave={onLeave}
								onClick={e => onClick(data, e)}
								style={{ cursor: 'pointer' }}
							>
								<rect
									x={width * -0.5}
									y={height * -0.5}
									width={width}
									height={height}
									fill={color}
									fillOpacity={opacity}
									strokeWidth={borderWidth}
									stroke={borderColor}
									strokeOpacity={opacity}
								/>
								{enableLabel && (
									<text
										alignmentBaseline="central"
										textAnchor="middle"
										style={{
											...theme.labels.text,
											fill: textColor
										}}
										fillOpacity={opacity}
									>
										{isNaN(value) ? 'NA' : value}
									</text>
								)}
							</g>
						);
					}}
				/>
			) : (
				<div className="noTissue">Please Select Any Tissue</div>
			)}
		</div>
	);
};

export default Heatmap;
