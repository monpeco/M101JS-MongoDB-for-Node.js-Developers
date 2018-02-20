var cursor =   db.movies.aggregate([
 { $project: { _id:0, title:1, year:1} },
  { $sort : {title: 1 }}, 
])

while(cursor.hasNext()){
    printjson(cursor.next());
}