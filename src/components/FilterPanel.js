import React from 'react';
import Dropdown from './Dropdown';

const FilterPanel = ({
	tissueList,
	filterGraph,
	updateFilter,
	expressionLevelFilter,
	selectedExpression,
	selectedScale,
	scaleFilter
}) => {
	return (
		<div className="filter-panel-root">
			<div className="filter-panel-title">Filter Panel</div>
			<div className="filter-panel">
				<div className="filter-container">
					<div className="tissue-filter">
						Tissues
						<div className="dropdown">
							<Dropdown options={tissueList} updateFilter={updateFilter} />
						</div>
					</div>
					<div className="expression-filter">
						Expression score
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
								>
									<input
										type="radio"
										id={term}
										value={term}
										onChange={scaleFilter}
										checked={selectedScale === term}
									/>
									<label htmlFor={term}>{term}</label>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<div className="button-container">
				<button type="button" className="filter-button" onClick={filterGraph}>
					Filter
				</button>
			</div>
		</div>
	);
};

export default FilterPanel;
