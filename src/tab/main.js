async function getLocationData() {
  const token = new URL(window.location.href).searchParams.get('id');
  return browser.runtime.sendMessage({
    id: 'storageRequest',
    asyncResponse: true,
    storageId: token
  });
}

async function start() {
  const data = await getLocationData();
  if (data?.tabUrl) {
    window.location.href = data.tabUrl;
  }
}

start();
