import DS from "ember-data";

var Pegrow = DS.Model.extend({
	pegs: DS.hasMany('peg',{async:true}),
	row: DS.attr('number')
});


Pegrow.reopenClass({
  FIXTURES: [
    { id: 1, pegs: [ 1, 2, 3, 4 ], row: 1 },
  ]
});

export default Pegrow;