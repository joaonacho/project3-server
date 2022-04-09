const { Schema, model } = require("mongoose");

const projectSchema = new Schema({
  title: String,
  description: String,
  imageUrl: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
});

module.exports = model("Project", projectSchema);
