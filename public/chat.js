const socket = io();

const urlSearch = new URLSearchParams(window.location.search);

const username = urlSearch.get("username");
const room = urlSearch.get("select_room");
