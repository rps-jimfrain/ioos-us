"use strict"
const express = require('express');
const router = express.Router();
const db = require('../lib/pg.js').db;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The U.S. Integrated Ocean Observing System (IOOS)' });
});

/* GET region map page. */
router.get('/regions', function(req, res, next) {
  res.render('regions', { title: 'The U.S. Integrated Ocean Observing System (IOOS) | Regions Map' });
});

/* GET contact us page. */
router.get('/contact-us', function(req, res, next) {
  res.render('contact-us', { title: 'The U.S. Integrated Ocean Observing System (IOOS) | Contact Us' });
});

/* GET comt about page. */
router.get('/comt', function(req, res, next) {
  const findProjects = 'SELECT title, SUBSTRING (overview, 0, 280) as overview, title_key FROM projects ORDER BY id ASC';
  db.any(findProjects)
  .then((data) => {
    res.render('comt/index', {
      title: 'The U.S. Integrated Ocean Observing System (IOOS) | Coastal and Ocean Modeling Testbed Projects',
      projects: data });
  })
  .catch((error) => {
    console.error(error);
  });
});

/* GET comt projects page. */
router.get('/comt/projects/:title_key', function(req, res, next) {
  const datasets = require('../public/comt_datasets').datasets;
  const findProjectTitles = 'SELECT title, title_key FROM projects ORDER BY id ASC';
  const projectDatasets = [];
  const findProject = 'SELECT id, title, team as "Project Team", overview as "Project Overview and Results", ' +
                    'model_desc as "Model Descriptions", sub_project_desc as "Sub-Project Descriptions/Data", ' +
                    'pubs as "Publications", title_key FROM projects WHERE title_key = $1';
  db.task((task) => {
    return task.batch([
      task.many(findProjectTitles),
      task.one(findProject, req.params.title_key)
    ]);
  })
  .then((data) => {
    datasets.forEach((dataset) => {
      if (dataset.comt.project === req.params.title_key) {
        projectDatasets.push(dataset);
      }
    });
    res.render('comt/project', {
      title: 'The U.S. Integrated Ocean Observing System (IOOS) | Coastal and Ocean Modeling Testbed Projects | ' + data[1].title,
      data: data,
      title_key: req.params.title_key,
      datasets: projectDatasets,
      path: req.path
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

/* GET comt dataset page. */
router.get('/comt/projects/:title_key/:dataset', function(req, res, next) {
  const datasetTitle = req.params.dataset;
  const datasets = require('../public/comt_datasets').datasets;

  // Find the first datasset with a matching title.
  const dataset = datasets.find((dataset, index) => {
    return dataset.title.replace(/[^\w]/g, '-').toLowerCase() === datasetTitle;
  });

  if (typeof dataset.variablesColored === "undefined") {
    let variables = require('../public/variables').variables;
    for (let i = 0; i < dataset.variablesMeasured.length; i++) {
      // Find a matching color if there is one defined
      let variableColor = variables.find((colorPair) => {
        return (colorPair[0] === dataset.variablesMeasured[i]) &&
               (colorPair[1] !== '#000000');
      });
      // If there is a matching color set the variable name to the color
      if (variableColor) {
        dataset.variablesMeasured[i] = variableColor;
      }
    }
    dataset.variablesColored = true;
  }
  const findProjectTitle = 'SELECT title FROM projects WHERE title_key = $1';
  db.one(findProjectTitle, req.params.title_key)
  .then((project) => {
    res.render('comt/dataset', {
      title: 'The U.S. Integrated Ocean Observing System (IOOS) | Coastal and Ocean Modeling Testbed Projects | ' + project.title + ' | Datasets',
      dataset: dataset,
      project: project,
      title_key: req.params.title_key,
      subProjectTitle: req.query.t
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

module.exports = router;
