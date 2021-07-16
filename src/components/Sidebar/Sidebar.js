import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Sidebar.scss';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import greentick from '../../images/right tick/greentick.png';
import { toggleSidebar } from '../../actions/toggleSidebar';
import arrowRight from '../../images/arrow/white/right/arrow-small-left.png';
import arrowLeft from '../../images/arrow/white/left/arrow-small-left.png';
import { scrollToTop, getPrimaryLanguage } from '../../utils/utils';
import constants from '../../utils/constants';
import labels from '../../utils/Locales/labels';
import { getPhasesFromState } from '../../pages/PhasesAndMore/selector';
import { checkPhasesHasLabels } from '../../actions/phasesAndMoreActions';
import InformationAlert from '../Alerts/AlertBox/InformationAlert/InformationAlert';
import messages from '../../utils/Locales/messages';

function Sidebar(props) {
  const { sidebarActiveProp, toggleSidebarProp, primaryLanguag } = props;
  const currentPhaseRef = useRef(null);

  // history for manage active route
  const history = useHistory();
  const [indexOfActiveMenuItem, setIndexOfActiveMenuItem] = useState(0);
  const [path, setPath] = useState(history.location.pathname);
  // const [subPhasePath, setSubPhasePath] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [isPhaseNotFoundAlertOpen, setIsPhaseNotFoundAlertOpen] = useState(
    false,
  );

  // indexOfActiveMenuItem : active menu item index

  const menuItems = [
    {
      phase: labels.MENU_ITEMS.PROPERTY_SETUP,
      subphases: [],
      status: '',
      path: constants.ROUTE.PROPERTY_SETUP.PROPERTY_SETUP, // use this path as subphases starting path if there is subPhases inside it
    },
    {
      phase: labels.MENU_ITEMS.USER_AND_ACCESS,
      subphases: [],
      status: '',
      path: constants.ROUTE.USER_AND_ACCESS.LIST,
    },
    {
      phase: labels.MENU_ITEMS.PHASES_AND_MORE.PHASES_AND_MORE,
      status: '',
      path: constants.ROUTE.PHASES_AND_MORE.PHASES_AND_MORE,
      subphases: [
        {
          subphase: labels.MENU_ITEMS.PHASES_AND_MORE.ADD_OR_UPDATE_PHASES,
          status: '',
          path: constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PHASES,
        },
        {
          subphase: labels.MENU_ITEMS.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES,
          status: '',
          path: constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_SUBPHASES,
        },
        {
          subphase:
            labels.MENU_ITEMS.PHASES_AND_MORE.ADD_OR_UPDATE_PRE_REQUESITES,
          status: '',
          path: constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE,
        },
        {
          subphase:
            labels.MENU_ITEMS.PHASES_AND_MORE
              .ADD_OR_UPDATE_PRE_REQUESITES_GROUP,
          status: '',
          path: constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PRE_REQUISITE_GROUP,
        },
      ],
    },
    {
      phase: labels.MENU_ITEMS.WORKFLOWS,
      subphases: [],
      status: '',
      path: constants.ROUTE.WORKFLOWS.LIST,
    },
    {
      phase: labels.MENU_ITEMS.DESIGN_FORMS,
      subphases: [],
      status: '',
      path: constants.ROUTE.DESIGN_FORMS.LIST,
    },
    {
      phase: labels.MENU_ITEMS.ADMIN_ROLES,
      subphases: [],
      status: '',
      path: constants.ROUTE.ADMIN_ROLES.LIST,
    },
  ];

  // history change
  useEffect(() => {
    if (history.location.pathname) setPath(history.location.pathname);
    return history.listen(location => {
      setPath(location.pathname);
    });
  }, [history]);

  // path change
  useEffect(() => {
    if (path) {
      const indexOfPhase = menuItems.findIndex(
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

  const handleRedirection = pathOfSubPhase => {
    // for subphase screen we need to check phases labels of primary language is must be added by user
    if (
      pathOfSubPhase === constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_SUBPHASES
    ) {
      // check phases have labels or not
      // setSubPhasePath(pathOfSubPhase);
      checkPhasesHasLabels().then(response => {
        const responseData = response.data;
        if (
          responseData &&
          responseData.success &&
          responseData.data[0].phases.length > 0
        ) {
          const { phases } = responseData.data[0];
          if (phases.length > 0) {
            const isPrimaryLableEmptyError = phases.some(phase => {
              if (phase.labels.length === 0) return true;
              return phase.labels.some(label => {
                const labelData = label;
                if (
                  labelData.propertyPhaseName === '' &&
                  labelData.languageCode === primaryLanguag
                )
                  return true;
                return false;
              });
            });
            if (isPrimaryLableEmptyError) {
              setAlertMessage(
                messages.PHASES_AND_MORE.ADD_OR_UPDATE_SUB_PHASES
                  .PHASES_LABEL_NOT_FOUND,
              );
              setIsPhaseNotFoundAlertOpen(true);
            } else {
              history.push(
                constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_SUBPHASES,
              );
            }
          }
        }
      });
    }
  };

  // handleAlertOKButtonClickForPhaseNotFound
  const handleAlertOKButtonClickForPhaseNotFound = () => {
    history.push(constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_PHASES);
    setIsPhaseNotFoundAlertOpen(false);
  };

  return (
    <>
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
          {menuItems.map((phaseVar, i) => {
            // console.log(phaseVar);
            return (
              <div key={phaseVar.phase} className="sidebar-section">
                <Phase
                  hasSubphase={phaseVar.subphases.length ? 'has-subphase' : ''}
                  phaseName={phaseVar.phase}
                  sidebarState={sidebarActiveProp}
                  path={phaseVar.path}
                  isOpen={i === indexOfActiveMenuItem}
                  isCurrent={phaseVar.path === `/${path.split('/')[1]}`}
                  ref={currentPhaseRef}
                  onClick={() => MenuToggle(i)}
                />
                {phaseVar.subphases.length && i === indexOfActiveMenuItem
                  ? phaseVar.subphases.map((subphaseVar, subphaseCount) => {
                      if (
                        subphaseVar.path ===
                        constants.ROUTE.PHASES_AND_MORE.ADD_UPDATE_SUBPHASES
                      ) {
                        return (
                          <div
                            role="button"
                            onKeyDown={null}
                            tabIndex={-1}
                            onClick={() => handleRedirection(subphaseVar.path)}
                          >
                            <Subphase
                              subphaseState={subphaseVar.status}
                              subphaseName={subphaseVar.subphase}
                              count={subphaseCount + 1}
                              noOfSubphases={phaseVar.subphases.length}
                              path={subphaseVar.path}
                              sidebarState={sidebarActiveProp}
                              isCurrent={
                                subphaseVar.path ===
                                `/${path.split('/')[1]}/${path.split('/')[2]}`
                              }
                            />
                          </div>
                        );
                      }
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
                              subphaseVar.path ===
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
      {/* alert message */}
      <InformationAlert
        alertMessage={alertMessage}
        primaryButtonText={labels.GLOBAL.OK}
        open={isPhaseNotFoundAlertOpen}
        setClose={() => {
          handleAlertOKButtonClickForPhaseNotFound();
        }}
        primaryButtonOnClick={() => handleAlertOKButtonClickForPhaseNotFound()}
        isCancelButton={false}
      />
    </>
  );
}

Sidebar.propTypes = {
  sidebarActiveProp: PropTypes.string.isRequired,
  toggleSidebarProp: PropTypes.func.isRequired,
  primaryLanguag: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  const { sidebarActive } = state;
  return {
    sidebarActiveProp: sidebarActive,
    phases: getPhasesFromState(state),
    primaryLanguag: getPrimaryLanguage(state),
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      toggleSidebarProp: toggleSidebar,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

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
    { isOpen, onClick, isCurrent, hasSubphase, sidebarState, phaseName, path },
    ref,
  ) => {
    return (
      <div
        className={`phase ${isOpen ? 'up' : ''} ${
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
}) => {
  // console.log(subphaseName);
  // alert(subphaseName);
  return (
    <div className={`subphase ${isCurrent ? 'current' : ''}`}>
      <div className="subphase-text-wrapper">
        <div className="status-flow">
          <div className="line">
            {sidebarState === 'sidebar-expanded' ? (
              <span className={`subphase-state ${isCurrent ? 'current' : ''}`}>
                {subphaseState === 'completed' ? (
                  <img src={greentick} alt={count} />
                ) : (
                  // count
                  <div className="dot" />
                )}
              </span>
            ) : (
              <PhaseTooltip phaseName={subphaseName}>
                <span
                  className={`subphase-state ${isCurrent ? 'current' : ''}`}
                >
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
};

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
