cube(`ZipsLoc`, {
  sql: `SELECT * FROM test.zips_loc`,
  
  joins: {
    
  },
  
  measures: {
    count: {
      type: `count`,
      drillMembers: []
    }
  },
  
  dimensions: {
    
  }
});
