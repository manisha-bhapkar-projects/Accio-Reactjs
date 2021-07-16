import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress, makeStyles } from '@material-ui/core';

const ColorLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#c19d29',
  },
  barColorPrimary: {
    backgroundColor: '#ffffff',
  },
  root: {
    height: 2,
  },
})(LinearProgress);

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(0),
    },
  },
}));

const ProgressBar = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <ColorLinearProgress />
    </div>
  );
};

export default ProgressBar;
