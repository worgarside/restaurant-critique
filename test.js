function addToList(test_list){
    test_list.push('thing1');
    test_list.push('thing2');
}

var test_list = [];
test_list.push('thing');
test_list.push('thing0');
console.log(test_list);

addToList(test_list);

console.log(test_list);

test_list.pop();

test_list['help me'] = 'yes';

console.log(test_list);



test_str = "Fast Food";

test_str.replace(/[^a-zA-Z]/g, "");

console.log(test_str);



var categories = [
    {_id: "FastFood", name: "Fast Food"},
    {_id: "Chicken", name: "Chicken"},
    {_id: "Inexpensive", name: "Inexpensive"},
    {_id: "Convenient", name: "Convenient"},
    {_id: "Portugese", name: "Portugese"},
    {_id: "Spicy", name: "Spicy"},
    {_id: "Burgers", name: "Burgers"},
    {_id: "Casual", name: "Casual"}
];


console.log(categories[0]);