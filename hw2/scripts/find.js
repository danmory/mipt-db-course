// 50 elements with locationID < 100
db.trips.find({ locationID: { $lt: 100 }}).limit(50);

// elements with locationID > 100 and Dispatching_base_num == 'B02598'
db.trips.find({ 
  locationID: { $gt: 100 },
  Dispatching_base_num: { $eq: 'B02598' }
});

// EXPLAIN предыдущего запроса
db.trips.explain().find({ 
  locationID: { $gt: 100 },
  Dispatching_base_num: { $eq: 'B02598' }
});

/* Поиск максимального времени подбора пассажира в locationID 141,
   сгруппированных по Dispatching_base_num.
   Результат отсортирован в порядке убывания по дате.
*/
db.trips.aggregate([
  { $match: { locationID: 141 } },
  { $group: { _id: "$Dispatching_base_num", maxPickupData: { $max: "$Pickup_date" }}},
  { $sort: { maxPickupData: -1 } }
]);

// Запрос выше занимает значительное количество времени, поэтому проанализируем его с помощью EXPLAIN:

db.trips.explain().aggregate([
  { $match: { locationID: 141 } },
  { $group: { _id: "$Dispatching_base_num", maxPickupData: { $max: "$Pickup_date" }}},
  { $sort: { maxPickupData: -1 } }
]);

// Поиск по locationID требует COLLSCAN. Добавим соответствующий индекс:

db.trips.createIndex({ locationID: 1 });

/* Ура, теперь наш поиск использует IXSCAN, если проверить через EXPLAIN. 
   Запустив запрос снова, скорость работы увеличивается значительно - нет задержки от слова совсем.
*/
