const express = require("express");
const validateJWT = require("../middleware/validate-session");
const router = express.Router();
const { Animal } = require("../models");


router.post("/create", validateJWT, async (req, res) => {
  let { name, legNumber, predator } = req.body.animal;
  let {userId} = req.user

  try {
      const newAnimal = await Animal.create({
          name,
          legNumber,
          predator,
          userId: userId
      });
      res.status(201).json({
          message: "Animal Saved",
      });
  } catch (err) {
      res.status(500).json({
          message: 'No animal data saved'
      });
  }
});

router.get("/", validateJWT, async (req, res) => {
  try {
    const animals = await Animal.findAll();
    res.status(200).json(animals);
  } catch (err) {
    res.status(500).json({
      message: "Dum Dum Dum",
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  const animalId = req.params.id;

  try {
    const query = {
      where: {
        id: animalId,
      },
    };

    await Animal.destroy(query);

    res.status(200).json({
      message: "deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Not Deleted",
    });
  }
});

router.put("/update/:Id", async (req, res) => {
  const { name, legNumber, predator } = req.body.animal;
  const animalId = req.params.Id;

  const query = {
    where: {
      id: animalId,
    },
  };

  const updatedAnimal = {
    name: name,
    legNumber: legNumber,
    predator: predator,
  };

  try {
    const update = await Animal.update(updatedAnimal, query);
    res.status(200).json({
      message: "Success",
      update: update,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed",
    });
  }
});

module.exports = router;