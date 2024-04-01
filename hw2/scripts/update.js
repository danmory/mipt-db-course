// Конвертируем дату подбору к "правильному" типу: из текста в дату:
db.trips.updateMany(
  {},
  [{ $set: { "Pickup_date": { $toDate: "$Pickup_date" } }}]
);

// Проверим:
db.trips.findOne({});
// Как можно увидеть, поле выводится с припиской ISODate

// Забавы ради, увеличим locationID у поездок с Dispatching_base_num == B02682 на 500.
db.trips.updateMany(
  { Dispatching_base_num: { $eq: 'B02682'}},
  { $inc: { locationID: 500 } }
);

// Проверим результат:
db.trips.find({ Dispatching_base_num: { $eq: 'B02682'} });
// Значения увеличились!

// На последок, удалим колонку с датами:
db.trips.updateMany({}, { $unset : {"Pickup_date": 1} });

// Проверим:
db.trips.findOne({});
// Поле пропало.
