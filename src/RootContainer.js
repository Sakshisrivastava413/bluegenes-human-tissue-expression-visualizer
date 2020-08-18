import React, { useEffect, useState } from 'react';
import Heatmap from './components/Heatmap';
import {
	queryData,
	illuminaDataQuery,
	RNASeqQuery,
	gTexDataQuery
} from './queries';
import FilterPanel from './components/FilterPanel';
import Loading from './components/Loading';

const RootContainer = ({ serviceUrl, entity }) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [dataAccToLevel, setDataAccToLevel] = useState([]);
	const [tissueList, setTissueList] = useState([]);
	const [heatmapData, setHeatmapData] = useState([]);
	const [heatmapTissueList, setHeatmapTissueList] = useState([]);
	const [selectedTissue, setSelectedTissue] = useState([]);
	const [selectedExpression, setSelectedExpression] = useState({});
	const [selectedScale, changeScale] = useState('Linear Scale');
	const [selectedDataSet, changeDataSet] = useState('GTex Data');
	const expressionLevel = ['Low', 'Medium', 'High'];

	useEffect(() => {
		let levelMap = {};
		expressionLevel.forEach(l => (levelMap = { ...levelMap, [l]: true }));
		setSelectedExpression(levelMap);
	}, []);

	useEffect(() => {
		setLoading(true);
		let { value } = entity;
		queryData({
			// conditionally querying data based on the selected dataset
			query: getQuery(),
			serviceUrl: serviceUrl,
			geneId: !Array.isArray(value) ? [value] : value
		})
			.then(data => {
				setData(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, [selectedDataSet]);

	useEffect(() => {
		const expressionLevelData = {};
		const tissueList = [];
		// For every level iterating data based on selected dataset received from the query and putting them
		// according to its expression level - low, medium, high. Also, filtering out
		// the tissue list that will be used passed to the filterpanel and heatmap as prop
		Object.keys(selectedExpression).map(level => {
			const levelData = [];
			data.forEach(d => {
				const obj = {};
				obj[d.class] = d.symbol;
				if (selectedDataSet == 'illumina Body Map') {
					d &&
						d.atlasExpression &&
						d.atlasExpression.forEach(tissue => {
							const { condition, expression } = tissue;
							if (tissueList.filter(t => t.value == condition).length == 0)
								tissueList.push({ label: condition, value: condition });
							// multiplied by 1 to convert string to number and then checking its expression level
							if (checkLevel(level, expression * 1))
								obj[condition] = (expression * 1).toFixed(2);
						});
				} else {
					d &&
						d.rnaSeqResults &&
						d.rnaSeqResults.forEach(res => {
							const { tissue, expressionScore } = res;
							if (tissueList.filter(t => t.value == tissue).length == 0)
								tissueList.push({ label: tissue, value: tissue });
							if (checkLevel(level, expressionScore))
								obj[tissue] = expressionScore.toFixed(2);
						});
				}
				levelData.push(obj);
			});
			expressionLevelData[level] = levelData;
		});
		setDataAccToLevel(expressionLevelData);
		setTissueList(tissueList);
		setSelectedTissue(tissueList);
		setHeatmapTissueList(tissueList);
	}, [data]);

	useEffect(() => {
		// initially merging data of all selected expression level to send it to heatmap
		formatDataAccToSelectedLevel();
	}, [dataAccToLevel, selectedExpression, selectedScale]);

	const getQuery = () => {
		if (selectedDataSet === 'GTex Data') return gTexDataQuery;
		if (selectedDataSet === 'illumina Body Map') return illuminaDataQuery;
		return RNASeqQuery;
	};

	const checkLevel = (level, val) => {
		if (level == 'Low') return val <= 10;
		if (level == 'Medium') return val > 10 && val <= 1000;
		if (level == 'High') return val > 1000;
	};

	const expressionLevelFilter = e => {
		const { value, checked } = e.target;
		// simply toggle the state of expression level in its map
		setSelectedExpression({
			...selectedExpression,
			[value]: checked
		});
	};

	const getValAccToDataset = () =>
		selectedDataSet === 'illumina Body Map' ||
		selectedDataSet === 'RNA Seq Data'
			? 150
			: 250;

	const formatDataAccToSelectedLevel = () => {
		// merge the data of those level whose value is true and is selected tissue in the filter panel
		// suppose the state is - low: true, medium: true and low: [{gene: ADH5, gland: 3}], medium: [{gene: ADH5, testis: 21}]
		// formatted data after merging them - [{gene: ADH5, gland: 3, testis: 21}]
		const obj = {};
		Object.keys(selectedExpression).map(level => {
			if (dataAccToLevel[level] !== undefined && selectedExpression[level]) {
				Object.values(dataAccToLevel[level]).map(data => {
					Object.keys(data).map(tissue => {
						const found = selectedTissue.find(t => t.value == tissue);
						if (found !== undefined || tissue === 'Gene') {
							if (tissue !== 'Gene' && selectedScale === 'Logarithmic Scale') {
								obj[data.Gene] = {
									...obj[data.Gene],
									[tissue]:
										data[tissue] < 1 ? 0 : Math.log10(data[tissue]).toFixed(2)
								};
							} else
								obj[data.Gene] = { ...obj[data.Gene], [tissue]: data[tissue] };
						}
					});
				});
			}
		});
		setHeatmapData([...Object.values(obj)]);
	};

	return (
		<div className="rootContainer">
			<div className="innerContainer">
				<div className="graph">
					{loading ? (
						<div className="loading">
							<Loading />
						</div>
					) : (
						<></>
					)}
					<div>
						{heatmapData.length ? (
							<div className="graph-container">
								<Heatmap
									tissueList={heatmapTissueList}
									graphData={heatmapData}
									labelHeight={getValAccToDataset()}
									graphHeight={heatmapData.length * 60 + getValAccToDataset()}
								/>
							</div>
						) : (
							<div className="noTissue">
								Data Not Found! Please Update The Filter.
							</div>
						)}
						<div className="lower-container">
							<FilterPanel
								tissueList={tissueList}
								updateFilter={value => setSelectedTissue(value)}
								selectedExpression={selectedExpression}
								expressionLevelFilter={expressionLevelFilter}
								selectedScale={selectedScale}
								scaleFilter={e => changeScale(e.target.value)}
								filterTissue={() => setHeatmapTissueList(selectedTissue)}
								selectedDataSet={selectedDataSet}
								filterDataSet={e => changeDataSet(e.target.value)}
							/>
							{heatmapData.length ? (
								<div className="legend">
									<div className="legend-options">
										<div className="legend-title">Expression Level</div>
									</div>
									<div className="legend-options">
										<div style={{ position: 'relative', top: 25, right: 10 }}>
											Low
										</div>
									</div>
									<div className="legend-options">
										<div style={{ position: 'relative', top: 25, left: 80 }}>
											Medium
										</div>
									</div>
									<div className="legend-options">
										<div style={{ position: 'relative', top: 25, left: 180 }}>
											High
										</div>
									</div>
								</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RootContainer;
