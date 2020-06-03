let list = []

export default async (req, res) => {

  if (req.query.add) {

    list.push(req.query.add)

  } else if (req.query.clear) {

    list = []

  }

  res.json(list)

}