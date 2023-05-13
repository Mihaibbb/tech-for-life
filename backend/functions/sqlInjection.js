const sqlInjectionBlacklist = [
    "SELECT",
    "INSERT",
    "UPDATE",
    "DELETE",
    "DROP",
    "UNION",
    "WHERE",
    "OR",
    "AND",
    "LIKE",
    "EXEC",
    "EXECUTE",
    "TRUNCATE",
    "DECLARE",
    "EXEC",
    "EXECUTE",
    "XP_",
    "--",
    "#",
    "/",
    "/"
  ];
  
  function containsSQLInjection(str) {
    const lowerCaseStr = str.toLowerCase();
    return sqlInjectionBlacklist.some(keyword => lowerCaseStr.includes(keyword));
  }
  
  module.exports = containsSQLInjection;