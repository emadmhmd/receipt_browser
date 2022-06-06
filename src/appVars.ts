function getVar(type: string) {
  const vars = new Map();
  vars.set('remotehost', 'https://biotopia.corelia.ai/api');
  vars.set('localhost', 'https://localhost:7115/api');
  return vars.get(type);
}

export default getVar;
