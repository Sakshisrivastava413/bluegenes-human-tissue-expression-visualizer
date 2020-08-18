import React from 'react';
import Dropdown from './Dropdown';

const FilterPanel = ({
	tissueList,
	filterTissue,
	updateFilter,
	expressionLevelFilter,
	selectedExpression,
	selectedScale,
	scaleFilter,
	selectedDataSet,
	filterDataSet
}) => {
	return (
		<div className="filter-panel-root">
			<div className="filter-panel-title">Filter Panel</div>
			<div className="filter-panel">
				<div className="filter-container">
					<div className="tissue-filter">
						Tissues
						<div className="dropdown">
							<Dropdown
								options={tissueList}
								updateFilter={updateFilter}
								filterTissue={filterTissue}
							/>
						</div>
					</div>
					<div className="expression-filter">
						Expression Level
						<div className="filter-option">
							{Object.keys(selectedExpression).map(term => (
								<div
									className={
										selectedExpression[term]
											? 'option selected'
											: 'option not-selected'
									}
									key={term}
								>
									<input
										type="checkbox"
										id={term}
										value={term}
										onChange={expressionLevelFilter}
										checked={selectedExpression[term]}
									/>
									<label htmlFor={term}>{term}</label>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="filter-container top">
					<div className="data-set-filter">
						Data Set
						<div className="filter-option">
							{['GTex Data', 'RNA Seq Data', 'illumina Body Map'].map(term => (
								<div
									className={
										selectedDataSet == term
											? 'option selected'
											: 'option not-selected'
									}
									onClick={() => filterDataSet(term)}
									key={term}
								>
									<input
										type="checkbox"
										id={term}
										value={term}
										onChange={e => filterDataSet(e.target.value)}
										checked={selectedDataSet == term}
									/>
									<label htmlFor={term}>{term}</label>
								</div>
							))}
						</div>
					</div>
					<div className="scale-filter">
						Scale
						<div className="filter-option">
							{['Linear Scale', 'Logarithmic Scale'].map(term => (
								<div
									className={
										selectedScale === term
											? 'option selected'
											: 'option not-selected'
									}
									key={term}
									onClick={() => scaleFilter(term)}
								>
									<input
										type="radio"
										id={term}
										value={term}
										onChange={e => scaleFilter(e.target.value)}
										checked={selectedScale === term}
									/>
									<label htmlFor={term}>{term}</label>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FilterPanel;
