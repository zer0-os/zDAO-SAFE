const styles = {
  global: {
    '.body': {
      // todo check how to do this without breaking the site
      // height: '100%', // Push footer to bottom
      overflowY: 'scroll', // Always show scrollbar to avoid flickering
    },
    html: {
      scrollBehavior: 'smooth',
    },
  },
};

export default styles;
