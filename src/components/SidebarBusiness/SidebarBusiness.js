/* eslint-disable jsx-a11y/no-static-element-interactions */
// import React, { useRef } from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import './Sidebar.scss';

// import { Tooltip, OverlayTrigger } from 'react-bootstrap';
// import greentick from '../../images/right tick/greentick.png';
// import { toggleSidebar } from '../../actions/toggleSidebar';

// function Sidebar({ sidebarActiveProp, toggleSidebarProp }) {
//   const currentPhaseRef = useRef(null);
import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './SidebarBusiness.scss';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import greentick from '../../images/right tick/greentick.png';
import { toggleSidebar } from '../../actions/toggleSidebar';
import arrowRight from '../../images/arrow/white/right/arrow-small-left.png';
import arrowLeft from '../../images/arrow/white/left/arrow-small-left.png';
import { scrollToTop } from '../../utils/utils';
// import constants from '../../utils/constants';
// import labels from '../../utils/Locales/labels';
import constsidebar from '../../utils/Locales/constsidebar';
import { getSidebarDataApiAction } from '../../actions/sidebarAction';
import { getSidebarSelector } from './selector';

function SidebarBusiness({
  sidebarActiveProp,
  toggleSidebarProp,
  getSidebarDataApi,
  menuItem,
}) {
  const currentPhaseRef = useRef(null);
  // history for manage active route
  const history = useHistory();
  const [indexOfActiveMenuItem, setIndexOfActiveMenuItem] = useState(0);
  const [path, setPath] = useState(history.location.pathname);

  useEffect(() => {
    getSidebarDataApi();
    if (history.location.pathname) setPath(history.location.pathname);
    return history.listen(location => {
      setPath(location.pathname);
    });
  }, [history]);
  useEffect(() => {
    // console.log('menuItem', menuItem);
  }, [menuItem]);
  // path change
  useEffect(() => {
    if (path) {
      const indexOfPhase = constsidebar.menuItems.findIndex(
        item => item.path === `/${path.split('/')[1]}`,
      );
      if (indexOfPhase && indexOfPhase >= 0)
        setIndexOfActiveMenuItem(indexOfPhase);
    }
  }, [path]);

  const toggleBar = () => {
    toggleSidebarProp();
  };

  const MenuToggle = i => {
    scrollToTop();
    if (i === indexOfActiveMenuItem) {
      setIndexOfActiveMenuItem('');
    } else {
      setIndexOfActiveMenuItem(i);
    }
  };

  const SubMenuToggle = i => {
    scrollToTop();
    setIndexOfActiveMenuItem(i);
  };
  // console.log(constsidebar);
  return (
    <div className={`sidebar-layout ${sidebarActiveProp}`}>
      <div className={`sidebar ${sidebarActiveProp}`}>
        <div className="sidebar-end">
          <div className={`arrow ${sidebarActiveProp}`}>
            <button type="button" className="arrow-btn" onClick={toggleBar}>
              {sidebarActiveProp === 'sidebar-expanded' ? (
                <img src={arrowLeft} alt="collapse" />
              ) : (
                <img src={arrowRight} alt="expand" />
              )}
            </button>
          </div>
        </div>
        {constsidebar.menuItems.map((phaseVar, i) => {
          return (
            <div key={phaseVar.phase} className="sidebar-section">
              <Phase
                hasSubphase={phaseVar.subphases.length ? 'has-subphase' : ''}
                phaseName={phaseVar.phase}
                phaseState={phaseVar.status}
                sidebarState={sidebarActiveProp}
                path={phaseVar.path}
                isOpen={i === indexOfActiveMenuItem}
                isCurrent={phaseVar.path === `/${path.split('/')[1]}`}
                ref={currentPhaseRef}
                onClick={() => MenuToggle(i)}
              />
              {phaseVar.subphases.length && i === indexOfActiveMenuItem
                ? phaseVar.subphases.map((subphaseVar, subphaseCount) => {
                    return (
                      <Link
                        key={subphaseVar.subphase}
                        to={subphaseVar.path}
                        onClick={() => SubMenuToggle(i, subphaseCount)}
                      >
                        <Subphase
                          subphaseState={subphaseVar.status}
                          subphaseName={subphaseVar.subphase}
                          count={subphaseCount + 1}
                          noOfSubphases={phaseVar.subphases.length}
                          path={subphaseVar.path}
                          sidebarState={sidebarActiveProp}
                          isCurrent={
                            `/${subphaseVar.path.split('/')[1]}/${
                              subphaseVar.path.split('/')[2]
                            }` ===
                            `/${path.split('/')[1]}/${path.split('/')[2]}`
                          }
                        />
                      </Link>
                    );
                  })
                : ''}
            </div>
          );
        })}
        <div className="sidebar-end-bottom">
          <div className="sidebar-end">
            <div className={`arrow ${sidebarActiveProp}`}>
              <button type="button" className="arrow-btn" onClick={toggleBar}>
                {sidebarActiveProp === 'sidebar-expanded' ? (
                  <img src={arrowLeft} alt="collapse" />
                ) : (
                  <img src={arrowRight} alt="expand" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
SidebarBusiness.defaultProps = {
  menuItem: [],
};
SidebarBusiness.propTypes = {
  sidebarActiveProp: PropTypes.string.isRequired,
  toggleSidebarProp: PropTypes.func.isRequired,
  getSidebarDataApi: PropTypes.func.isRequired,
  menuItem: PropTypes.instanceOf(Array),
};

function mapStateToProps(state) {
  return {
    sidebarActiveProp: state.sidebarActive,
    menuItem: getSidebarSelector(state),
  };
}

export default connect(mapStateToProps, {
  toggleSidebarProp: toggleSidebar,
  getSidebarDataApi: getSidebarDataApiAction,
})(SidebarBusiness);

const ConditionalLink = ({ children, isLink, ...rest }) =>
  isLink ? <Link {...rest}>{children}</Link> : <>{children}</>;

ConditionalLink.propTypes = {
  isLink: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]).isRequired,
};

const Phase = React.forwardRef(
  (
    {
      isOpen,
      onClick,
      isCurrent,
      hasSubphase,
      sidebarState,
      phaseName,
      path,
      phaseState,
    },
    ref,
  ) => {
    return (
      <div
        className={`phase ${phaseState} ${isOpen ? 'up' : ''} ${
          isCurrent ? 'current' : ''
        } ${hasSubphase}`}
        onClick={onClick}
        onKeyDown={() => null}
        tabIndex="-1"
        role="button"
      >
        {hasSubphase === 'has-subphase' ? (
          <>
            <div className="phase-text-wrapper">
              <div className="phase-text" ref={ref}>
                {phaseName}
              </div>
            </div>
            {sidebarState === 'sidebar-expanded' ? (
              <div className="status-box" />
            ) : (
              <PhaseTooltip phaseName={phaseName}>
                <div className="status-box" />
              </PhaseTooltip>
            )}
          </>
        ) : (
          <>
            <Link to={path}>
              <div className="phase-text-wrapper">
                <div className="phase-text" ref={ref}>
                  {phaseName}
                </div>
              </div>
            </Link>
            {sidebarState === 'sidebar-expanded' ? (
              <Link className="status-box" to={path}>
                {/* <div className="status-box" /> */}
              </Link>
            ) : (
              <PhaseTooltip phaseName={phaseName}>
                <Link className="status-box" to={path} />
              </PhaseTooltip>
            )}
          </>
        )}
      </div>
    );
  },
);

Phase.propTypes = {
  hasSubphase: PropTypes.string.isRequired,
  phaseName: PropTypes.string.isRequired,
  phaseState: PropTypes.string.isRequired,
  sidebarState: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Subphase = ({
  isCurrent,
  subphaseState,
  count,
  noOfSubphases,
  subphaseName,
  sidebarState,
}) => (
  <div className={`subphase ${isCurrent ? 'current' : ''}`}>
    <div className="subphase-text-wrapper">
      <div className="status-flow">
        <div className="line">
          {sidebarState === 'sidebar-expanded' ? (
            <span className={`subphase-state ${isCurrent ? 'current' : ''}`}>
              {subphaseState === 'completed' ? (
                <img src={greentick} alt={count} />
              ) : (
                count
                // <div className="dot" />
              )}
            </span>
          ) : (
            <PhaseTooltip phaseName={subphaseName}>
              <span className={`subphase-state ${isCurrent ? 'current' : ''}`}>
                {subphaseState === 'completed' ? (
                  <img src={greentick} alt={count} />
                ) : (
                  // count
                  <div className="dot" />
                )}
              </span>
            </PhaseTooltip>
          )}
        </div>
        {noOfSubphases !== count ? (
          <div className="dot" />
        ) : (
          <div className="last-subphase-line" />
        )}
      </div>
      <div className={`subphase-text ${isCurrent ? 'current' : ''}`}>
        {subphaseName}
      </div>
    </div>
  </div>
);

Subphase.propTypes = {
  subphaseState: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  noOfSubphases: PropTypes.number.isRequired,
  subphaseName: PropTypes.string.isRequired,
  isCurrent: PropTypes.bool.isRequired,
  sidebarState: PropTypes.string.isRequired,
};

const PhaseTooltip = ({ phaseName, children }) => {
  return (
    <>
      <OverlayTrigger
        key="right"
        placement="right"
        overlay={
          <Tooltip id="tooltip-right">
            <div className="tooltip-text">{phaseName}</div>
          </Tooltip>
        }
      >
        {children}
      </OverlayTrigger>
    </>
  );
};

PhaseTooltip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]).isRequired,
  phaseName: PropTypes.string.isRequired,
};
