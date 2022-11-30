const fetchdata = async (res, data) => {
  const url = process.env.REACT_APP_URL;
  const d = document.cookie
    .split(";")
    .map((e) => e.split("="))
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k.trim()]: decodeURIComponent(v) }),
      {}
    );
  if (!d.token || d.token.length === 0) {
    window.location.href = "/";
  }
  //  console.log("fetch called");
  res = await fetch(url + "user-profile-fetch-moNO", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: d.token }),
  });
  data = await res.json();
  if (data.stcode === 105) {
    window.location.href = "/";
  }
  document.cookie = `username=${data.username}`;
  console.log("fetchdata xxx = ", data);
  return data;
};

export default fetchdata;
