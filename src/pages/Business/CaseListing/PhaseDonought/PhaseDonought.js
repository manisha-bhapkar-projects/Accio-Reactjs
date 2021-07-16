import React from 'react';
import './PhaseDonought.scss';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { PieChart } from 'react-minimal-pie-chart';

function PhaseDonought({ onDonoughtBoxClick, title, data }) {
  return (
    <div className="phase-donought-chart">
      <Card className="phase-card" onClick={onDonoughtBoxClick}>
        <div className="phase-card-title">{title}</div>

        <div
          className={
            data.find(item => item.title !== 'on-hold')
              ? 'donought-with-total'
              : 'donought-with-total on-hold'
          }
        >
          <div className="donought-chart-box">
            <PieChart
              startAngle={180}
              data={data}
              lineWidth={15}
              rounded
              segmentsStyle={segmentIndex => {
                if (segmentIndex === 0) {
                  return { strokeWidth: 5 };
                }
                return { strokeWidth: 7 };
              }}
              background={
                data.some(item => item.value !== 0) ? '#ffffff' : '#dfe0e5'
              }
              radius={50}
            />
          </div>

          <div className="donought-total">
            {data.reduce((total, num) => {
              return total + num.value;
            }, 0)}
          </div>

          {data.find(item => item.title !== 'on-hold') ? (
            <div className="legends">
              <p>
                <span className="on-track-dot" />
                <span className="legend-text">
                  {data.find(item => item.title === 'on-track').value}
                </span>
              </p>
              <p>
                <span className="delayed-dot" />
                <span className="legend-text">
                  {data.find(item => item.title === 'delayed').value}
                </span>
              </p>
            </div>
          ) : (
            ''
          )}
        </div>
      </Card>
    </div>
  );
}

PhaseDonought.propTypes = {
  onDonoughtBoxClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
};

export default PhaseDonought;
