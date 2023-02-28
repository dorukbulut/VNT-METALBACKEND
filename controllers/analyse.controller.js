import Analyze from "../models/analyze.model.js";

//Done
export const createAnalyse = async (req, res) => {
  try {
    const new_analyse = { ...req.body };

    let _ = await Analyze.create(new_analyse.analyze);

    res.status(200).json({ message: "Analyze Created" });
  } catch (err) {
    res.status(500).json({ message: "An error occured." });
  }
};

//Done
export const updateAnalyze = async (req, res) => {
  try {
    const analyse = { ...req.body };

    if (
      await Analyze.findOne({
        where: {
          analyze_id: analyse.analyze_id,
        },
      })
    ) {
      let retval = await Analyze.update(analyse.analyze, {
        where: {
          analyze_id: analyse.analyze_id,
        },
      });

      res.status(200).json({ message: "Analyze Updated" });
    } else {
      res.status(401).json({ message: "Cannot find analyze" });
    }
  } catch (err) {
    res.status(500).json({ message: "An error occurred." });
  }
};

//Done
export const getAnalyse = async (req, res) => {
  const q = { ...req.body };

  try {
    const analyze = await Analyze.findAll({
      where: {
        analyze_id: q.analyze_id,
      },
    });

    if (analyze.length !== 0) {
      res.status(200).json({ analyze });
    } else {
      res.status(401).json({ message: "Cannot find any analyze" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured" });
  }
};

//Done
export const getAllAnalyze = async (req, res) => {
  try {
    const analyzes = await Analyze.findAll();
    if (analyzes !== 0) {
      res.status(200).json({ analyzes });
    } else {
      res.status(401).json({ message: "No Analyze found in database" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "An error occured" });
  }
};

export default {
  createAnalyse,
  updateAnalyze,
  getAllAnalyze,
  getAnalyse,
};
