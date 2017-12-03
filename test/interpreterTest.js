const interpreter = require('../src/script');

const script = `
meta('$..dataset.topics')
distinct()
set('tg')

meta('$..dataset.label')
distinct()
translate()
set('ds')

<?javascript

  var dm = [];
  
  $context.ds.forEach(function(d, index){
    
    var row = [] 
    for(var i = 0; i<$context.ds.length; i++){ 
      row.push(
          _.intersection(
              $context.tg[index],
              $context.tg[i]).length
              )
    }
     var max = row[index]
     dm.push({
         key: $context.ds[index],
         values: row.map(function(v,ind){
             return {
                 label: $context.ds[ind],
                 value: v/max
                 
             }
         })
     })   
 })

  $context.dm = dm;

?>

get('dm')
cache()
`;

let context = {};
let dpsInterpreter = new interpreter(null, script, context);
dpsInterpreter.run(dpsInterpreter.state());