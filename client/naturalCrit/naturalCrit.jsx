var React = require('react');
var _ = require('lodash');
var cx = require('classnames');


var Sidebar = require('./sidebar/sidebar.jsx');

var Encounter = require('./encounter/encounter.jsx');


var encounters = [
	{
		name : 'The Big Bad',
		desc : 'The big fight!',
		reward : 'gems',
		enemies : ['goblin', 'goblin'],
		reserve : ['goblin'],
	},
	{
		name : 'Demon Goats',
		desc : 'Gross fight',
		reward : 'curved horn, goat sac',
		enemies : ['demon_goat', 'demon_goat', 'demon_goat'],
		index : {
			demon_goat : {
				"hp" : 140,
				"ac" : 16,
				"attr" : {
					"str" : 8,
					"con" : 8,
					"dex" : 8,
					"int" : 8,
					"wis" : 8,
					"cha" : 8
				},
				"attacks" : {
					"charge" : {
						"atk" : "1d20+5",
						"dmg" : "1d8+5",
						"type" : "bludge"
					}
				},
				"abilities" : ["charge"],
			}
		}
	},

];

var monsterManual = {
	'goblin' : {
		"hp" : 40,
		"mov": 30,
		"ac" : 13,
		"attr" : {
			"str" : 8,
			"con" : 8,
			"dex" : 8,
			"int" : 8,
			"wis" : 8,
			"cha" : 8
		},
		"attacks" : {
			"dagger" : {
				"atk" : "1d20-5",
				"dmg" : "1d4+5",
				"type" : "pierce",
				"notes" : "Super cool"
			},
			"bow" : {
				"atk" : "1d20+2",
				"dmg" : "6d6",
				"rng" : "30"
			}
		},
		"spells" : {
			"fireball": {
				"dmg" : "6d6",
				"uses" : 4
			},
			"healing_bolt" : {
				"heal" : "2d8+4",
				"uses" : 6
			}
		},
		"abilities" : ["pack tactics"],
		"items" : ['healing_potion', 'healing_potion', 'ring']
	}
}

var attrMod = function(attr){
	return Math.floor(attr/2) - 5;
}


var NaturalCrit = React.createClass({

	getInitialState: function() {
		var self = this;
		return {
			selectedEncounterIndex : 0,
			encounters : JSON.parse(localStorage.getItem('encounters')) || encounters,
			monsterManual : JSON.parse(localStorage.getItem('monsterManual')) || monsterManual,

			players : localStorage.getItem('players') || 'jasper 13\nzatch 19'

		};
	},


	handleEncounterJSONChange : function(encounterIndex, json){
		this.state.encounters[encounterIndex] = json;
		this.setState({
			encounters : this.state.encounters
		})
		localStorage.setItem("encounters", JSON.stringify(this.state.encounters));
	},
	handleMonsterManualJSONChange : function(json){
		this.setState({
			monsterManual : json
		});
		localStorage.setItem("monsterManual", JSON.stringify(this.state.monsterManual));
	},
	handlePlayerChange : function(e){
		this.setState({
			players : e.target.value
		});
		localStorage.setItem("players", e.target.value);
	},
	handleSelectedEncounterChange : function(encounterIndex){
		this.setState({
			selectedEncounterIndex : encounterIndex
		});
	},
	handleRemoveEncounter : function(encounterIndex){
		this.state.encounters.splice(encounterIndex, 1);
		this.setState({
			encounters : this.state.encounters
		});
		localStorage.setItem("encounters", JSON.stringify(this.state.encounters));
	},

	renderSelectedEncounter : function(){
		var self = this;
		var selectedEncounter = _.find(this.state.encounters, function(encounter){
			return encounter.name == self.state.selectedEncounter;
		});

		if(this.state.selectedEncounterIndex != null){
			var selectedEncounter = this.state.encounters[this.state.selectedEncounterIndex]
			return <Encounter
				key={selectedEncounter.name}
				{...selectedEncounter}
				monsterManual={this.state.monsterManual}
				players={this.state.players}
			/>
		}

		return null;
	},


	render : function(){
		var self = this;
		return(
			<div className='naturalCrit'>
				<Sidebar
					selectedEncounter={this.state.selectedEncounterIndex}
					encounters={this.state.encounters}
					monsterManual={this.state.monsterManual}
					players={this.state.players}

					onSelectEncounter={this.handleSelectedEncounterChange}
					onRemoveEncounter={this.handleRemoveEncounter}
					onJSONChange={this.handleEncounterJSONChange}
					onMonsterManualChange={this.handleMonsterManualJSONChange}
					onPlayerChange={this.handlePlayerChange}
				/>


				{this.renderSelectedEncounter()}

			</div>
		);
	}
});

module.exports = NaturalCrit;

