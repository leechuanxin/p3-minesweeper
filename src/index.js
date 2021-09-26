import axios from 'axios';
import './styles.scss';

console.log('hello');
// Make a request for all the items
axios.get('/items')
  .then((response) => {
    // handle success
    console.log(response.data.items);

    const itemCont = document.createElement('div');

    response.data.items.forEach((item) => {
      const itemEl = document.createElement('div');
      itemEl.innerText = JSON.stringify(item);
      itemEl.classList.add('item');
      document.body.appendChild(itemEl);
    });

    document.body.appendChild(itemCont);
  })
  .catch((error) => {
    // handle error
    console.log(error);
  });
