function EventManager() {
    this.eventSpawnTime = 3600000;
    this.eventSpawnTimeRemaining = this.eventSpawnTime;
    this.events = new Array();

    this.addRandomEvent = function addRandomEvent(level) {
        var event = new Event(this.events.length + 1);
        event.type = EventType.QUEST;
        // Create a random quest
        var name = QuestNamePrefixes[Math.floor(Math.random() * 5)] + ' the ' + QuestNameSuffixes[Math.floor(Math.random() * 5)];
        var amount = Math.floor(Math.random() * 6) + 7;
        event.quest = new Quest(name, ("Kill " + amount + " level " + level + " monsters."), QuestType.KILL, level, amount, (level * 10), (level * 10), legacyGame.player.buffs.getRandomQuestRewardBuff());
        this.events.push(event);

        var newDiv = document.createElement('div');
        newDiv.id = 'eventButton' + event.id;
        newDiv.className = 'eventButton button';
        newDiv.onmousedown = function () { clickEventButton(newDiv, event.id); }
        var container = document.getElementById("eventsArea");
        container.appendChild(newDiv);
    }

    this.update = function update(ms) {
        // Add a new event if enough time has passed
        this.eventSpawnTimeRemaining -= ms;
        if (this.eventSpawnTimeRemaining <= 0) {
            this.eventSpawnTimeRemaining = this.eventSpawnTime;
            this.addRandomEvent(legacyGame.player.level);
        }

        // Keep all the event buttons falling down
        var elements = document.getElementsByClassName('eventButton');
        for (var x = 0; x < this.events.length; x++) {
            var element = elements[x]
            var parent = element.parentNode;
            var bottom = parent.clientHeight - element.offsetTop - element.clientHeight;
            var minBottom = x * 25;
            var newBottom = bottom - (this.events[x].velY * (ms / 1000));
            if (newBottom < minBottom) { newBottom = minBottom; this.events[x].velY = 0; }
            element.style.bottom = newBottom + 'px';
            this.events[x].velY += 10;
        }
    }

    this.startEvent = function startEvent(obj, id) {
        // Remove the event button
        obj.parentNode.removeChild(obj);
        legacyGame.questsManager.addQuest(this.events[id - 1].quest);
        this.events.splice(id - 1, 1);

        // Change all the ids of the events that need changing
        for (var x = id - 1; x < this.events.length; x++) {
            this.events[x].id--;
        }
    }
}