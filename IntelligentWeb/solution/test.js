const dateFormat = require('dateformat');
const now = dateFormat(new Date(), "yyyy-mm-dd-HH-MM-ss");
console.log(now);


// const users, restaurants, reviews, categories;
// users = restaurants = reviews = categories = [];
//
// users.push("user1");
//
// console.log(users);
//
// console.log(reviews);

// function addToList(test_list){
//     test_list.push('thing1');
//     test_list.push('thing2');
// }
//
// const test_list = [];
// test_list.push('thing');
// test_list.push('thing0');
// console.log(test_list);
//
// addToList(test_list);
//
// console.log(test_list);
//
// test_list.pop();
//
// test_list['help me'] = 'yes';
//
// console.log(test_list);
//
//
//
// test_str = "Fast Food";
//
// test_str.replace(/[^a-zA-Z]/g, "-");
//
// console.log(test_str);
//
//
//
// const categories = [
//     {_id: "FastFood", name: "Fast Food"},
//     {_id: "Chicken", name: "Chicken"},
//     {_id: "Inexpensive", name: "Inexpensive"},
//     {_id: "Convenient", name: "Convenient"},
//     {_id: "Portugese", name: "Portugese"},
//     {_id: "Spicy", name: "Spicy"},
//     {_id: "Burgers", name: "Burgers"},
//     {_id: "Casual", name: "Casual"}
// ];
//
//
// console.log(categories[0]);