var Nmy4pc = function() {
    var n = this;
    Nmy0.call( n );
    n.fill = '#444';
}

var Nmy4 = function() {
  var n = this;
    Nmy0.call( n );
    n.fill = '#444';
    n.v = 2 + utl.infany( 1 ),
    n.mmbrs = [],

  for ( var i = utl.any( 4, 0 ) + 1; i >= 0; i-- ) {
    n.mmbrs.push( new Nmy4pc() );
  };

}

/*

strds

consists of 1-4 nmys.
[x,y], [ xy ] + ( 0, r ), [ xy ] + ( pi / 3 ,r ), [ xy ] + ( pi * 2 / 3, r )

x, y like nmy init.
a will be range of pi / 2, heading in.
spin - rand.
spin speed - also rand.

each mv,
rm group like bullets if off env
set each nmy x, y, a. Calc from group x, y, spin, offset.
test each member for hit tail nmys and plr. And bad nmys?

one of group hit: it explds. rm from group list. Use a of bullet or tail nmy to change whole a.
Change to new spin speed randomly.
if last of group, rm whole.

draw: less extreme versions of bg for each member.
no stroke so fit together? Could emulate stroke by drawing slightly larger darker group members first

*/
