// Удалим все поездки Dispatching_base_num == 'B02617'
db.trips.deleteMany({ "Dispatching_base_num": { $eq: 'B02617'} });

// Проверим, осталось ли что-то:
db.trips.countDocuments({ "Dispatching_base_num": { $eq: 'B02617'} });
// Как и ожидалось - 0.

// Удалим документы по двум условиям:
db.trips.deleteMany({
  "Affiliated_base_num": { $eq: 'B02789' },
  "locationID": { $lt: 100 }
});
// ~12000 документов удалилось.

// И, напоследок, почистим всю коллекцию целиком.
db.trips.deleteMany({});

// Проверим:
db.trips.countDocuments({});
// 0.