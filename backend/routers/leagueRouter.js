const express = require('express');

const authenticate = require('../middleware/authenticate.js');
const leagueModel = require('../data/models/leagueModel.js');
const teamModel = require('../data/models/teamModel.js');
const gameModel = require('../data/models/gameModel.js');

const router = express.Router();

router.use(authenticate);

router.post('/', (req, res) => {
  const user = req.user;
  const league = req.body;
  // console.log(league);
  leagueModel
    .insert(league, user)
    .then(ids => {
      // console.log(ids);
      leagueModel
        .findById(ids[0])
        .then(newLeague => {
          res.status(201).json(newLeague);
        })
        .catch(err => {
          res.status(404).json({ error: 'Trouble finding new league' });
        });
    })
    .catch(err => {
      res.status(500).json({ error: 'Problem adding new league', err });
    });
});

router.get('/', (req, res) => {
  const user = req.user;
  leagueModel
    .getLeaguesByUser(user)
    .then(leagues => {
      res.json(leagues);
    })
    .catch(err => {
      res.status(500).json({ error: 'Cannot get all leagues', err });
    });
});

router.get('/:lid', (req, res) => {
  const { lid } = req.params;
  leagueModel
    .findById(lid)
    .then(league => {
      if (league) {
        res.json(league);
      } else {
        res.status(404).json({
          message: 'The league with the specified id does not exist!'
        });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Trouble getting the League', err });
    });
});

router.put('/:lid', (req, res) => {
  const { lid } = req.params;
  const league = req.body;
  league.admin_user_id = req.user.id;
  if (league.name && league.admin_user_id) {
    leagueModel
      .update(lid, league)
      .then(updatedLeague => {
        if (updatedLeague) {
          leagueModel
            .findById(lid)
            .then(league => {
              res.json(league);
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: 'Could not return updated League', err });
            });
        } else {
          res.status(404).json({
            error: 'The league with the specified id does not exist!'
          });
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: 'The league could not be modified!', err });
      });
  } else {
    res
      .status(400)
      .json({ message: 'You are missing required league information!' });
  }
});

router.delete('/:lid', (req, res) => {
  const { lid } = req.params;
  leagueModel
    .remove(lid)
    .then(removed => {
      if (removed) {
        res.json({ message: 'league has been deleted!' });
      } else {
        res.status(500).json({ message: 'league id does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'The league could not be removed!', err });
    });
});

//The beginning of the league teams endpoints

router.post('/:lid/teams', (req, res) => {
  const { lid } = req.params;
  const team = req.body;
  team.league_id = lid;
  teamModel
    .insert(team)
    .then(ids => {
      res.status(201).json({ message: `New team added with ${ids[0]}!` });
    })
    .catch(err => {
      res.status(500).json({ error: 'Problem adding new team!', err });
    });
});

router.get('/:lid/teams', (req, res) => {
  const { lid } = req.params;
  leagueModel
    .getTeamsByLeague(lid)
    .then(teams => {
      res.json(teams);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'Trouble retrieving teams for league', err });
    });
});

router.get('/:lid/teams/:tid', (req, res) => {
  const { tid } = req.params;
  teamModel
    .getTeamById(tid)
    .then(teams => {
      res.json(teams);
    })
    .catch(err => {
      res.status(500).json({ error: 'Trouble retrieving team', err });
    });
});

router.put('/:lid/teams/:tid', (req, res) => {
  const { lid, tid } = req.params;
  const team = req.body;
  team.league_id = lid;

  if (team.name && team.league_id) {
    teamModel
      .update(tid, team)
      .then(count => {
        if (count) {
          teamModel
            .getTeamById(tid)
            .then(team => {
              res.json(team);
            })
            .catch(err => {
              res
                .status(500)
                .json({ error: 'Could not return updated Team', err });
            });
        } else {
          res.status(404).json({
            error: 'The team with the specified id does not exist!'
          });
        }
      })
      .catch(err => {
        res.status(500).json({ error: 'The team could not be modified!', err });
      });
  } else {
    res
      .status(400)
      .json({ message: 'You are missing required team information!' });
  }
});

router.delete('/:lid/teams/:tid', (req, res) => {
  const { tid } = req.params;
  teamModel
    .remove(tid)
    .then(removed => {
      if (removed) {
        res.json({ message: 'Team has been deleted!' });
      } else {
        res.status(500).json({ message: 'Team id does not exist' });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'The team could not be removed!', err });
    });
});

// The beginning of the league schedule endpoints

router.post('/:lid/schedule', (req, res) => {
  const { lid } = req.params;
  const games = req.body;
  games.forEach(function(element) {
    element.league_id = lid;
  });
  gameModel
    .insert(games)
    .then(ids => {
      res.status(201).json(ids);
    })
    .catch(err => {
      res.status(500).json({ error: 'Problem adding games!', err });
    });
});

router.get('/:lid/schedule', (req, res) => {
  const { lid } = req.params;
  gameModel
    .getGamesByLeague(lid)
    .then(games => {
      res.json(games);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: 'Trouble retrieving games for league', err });
    });
});

module.exports = router;
