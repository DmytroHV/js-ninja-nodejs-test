let state = null;
const token = null;
const socket = new WebSocket('ws://node-test-task.javascript.ninja');
const socketQueue = [];

socket.onopen = function(event) {
  setTimeout(function() {
    fetch('http://node-test-task.javascript.ninja', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then(response => {
        return response.json();
      })
      .then(response => {
        state = response;
        console.log({ state });
      });
  }, 6000);
};

const toggleLeverState = leverLabel => {
  if (state.levers[leverLabel] === 'up') {
    state.levers[leverLabel] = 'down';
  } else {
    state.levers[leverLabel] = 'up';
  }
};

socket.onclose = function(event) {
  console.log({ token });
  console.log(event.reason);
  console.log(event.data);
  alert('Yeppy!');
};

socket.onmessage = function(event) {
  console.log(event.data);
  const data = JSON.parse(event.data);
  // console.log({ data });
  // console.log({ token });
  if (data.revision) {
    socketQueue.push(data);
  } else {
    token = data;
  }

  if (!state) return;

  // const nextState = socketQueue[state.revision + 1];
  const nextState = socketQueue.find(el => el.revision === state.revision + 1);
  console.log(socketQueue);
  console.log({ nextState });
  const arrToApply = socketQueue.slice(socketQueue.indexOf(nextState));
  arrToApply.forEach(res => {
    state.revision = res.revision;
    Object.keys(res.levers).forEach(lever => {
      if (res.levers[lever] === 'changed') {
        toggleLeverState(lever);
      }
    });
  });

  if (Object.values(state.levers).every(lever => lever === 'down')) {
    socket.send('shutdown');
  }
};


{"link":"https://bit.ly/2MxxNlU","token":"eyJhbGciOiJIUzI1NiJ9.MTU1OTU5MDIyMzE1NQ.GbTbE39Nu6usl9E8g331KKwa2MXgqJwXUcg9uc0PrYY"}