import DS from "ember-data";

var Peg = DS.Model.extend({
	pegrow: DS.belongsTo('pegrow'),
	pos: DS.attr('number'),
	color: DS.attr('string')
});

Peg.reopenClass({
  FIXTURES: [
    { id: 1, pegrow: 1, pos: 1, color: 'red'},
    { id: 2, pegrow: 1, pos: 3, color: 'green'},
    { id: 3, pegrow: 1, pos: 2, color: 'blue'},
    { id: 4, pegrow: 1, pos: 4, color: 'yellow'}
  ]
});

export default Peg;