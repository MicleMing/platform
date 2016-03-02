/**
 * https://github.com/rsms/js-lru
 *
 * @param {Number} limit
 * @constructor
 */
define(function (require, exports, module) {

    function LRUCache (limit) {
        this.size = 0;
        this.limit = limit;
        this.head = this.tail = undefined;
        this._keymap = Object.create(null);
    }

    /**
     * Put <value> into the cache associated with <key>.
     * Returns the entry which was removed to make room for
     * the new entry. Otherwise undefined is returned.
     * (i.e. if there was enough room already).
     *
     * @param {String} key
     * @param {*} value
     * @return {Entry|undefined}
     */

    LRUCache.prototype.put = function (key, value) {
        var entry = {
            key: key,
            value: value
        };
        this._keymap[key] = entry;
        if (this.tail) {
            this.tail.newer = entry;
            entry.older = this.tail;
        } else {
            this.head = entry;
        }
        this.tail = entry;
        if (this.size === this.limit) {
            return this.shift();
        } else {
            this.size++;
        }
    }

    /**
     * Purge the least recently used (oldest) entry from the
     * cache. Returns the removed entry or undefined if the
     * cache was empty.
     */

    LRUCache.prototype.shift = function () {
        var entry = this.head;
        if (entry) {
            this.head = this.head.newer;
            this.head.older = undefined;
            entry.newer = entry.older = undefined;
            this._keymap[entry.key] = undefined;
        }
        return entry;
    }

    /**
     * Get and register recent use of <key>. Returns the value
     * associated with <key> or undefined if not in cache.
     *
     * @param {String} key
     * @param {Boolean} returnEntry
     * @return {Entry|*}
     */

    LRUCache.prototype.get = function (key, returnEntry) {
        var entry = this._keymap[key];
          if (entry === undefined) return;
          if (entry === this.tail) {
              return returnEntry
                ? entry
                : entry.value;
          }
        // HEAD--------------TAIL
        //   <.older   .newer>
        //  <--- add direction --
        //   A  B  C  <D>  E
        if (entry.newer) {
            if (entry === this.head) {
                this.head = entry.newer;
            }
            entry.newer.older = entry.older; // C <-- E.
        }
        if (entry.older) {
            entry.older.newer = entry.newer; // C. --> E
        }
        entry.newer = undefined; // D --x
        entry.older = this.tail; // D. --> E
        if (this.tail) {
            this.tail.newer = entry; // E. <-- D
        }
        this.tail = entry;
        return returnEntry
            ? entry
            : entry.value;
    }
    /**
     * Update the value of entry with <key>. Returns the old value, or undefined if
     * entry was not in the cache.
     */
    LRUCache.prototype.set = function(key, value) {
        var oldvalue;
        var entry = this.get(key, true);
        if (entry) {
            oldvalue = entry.value;
            entry.value = value;
        } else {
            oldvalue = this.put(key, value);
            if (oldvalue) {
                oldvalue = oldvalue.value;
            }
        }
        return oldvalue;
    };

    /**
     * Remove entry <key> from cache and return its value. Returns undefined if not
     * found.
     */
    LRUCache.prototype.remove = function(key) {
        var entry = this._keymap[key];
        if (!entry) return;
        delete this._keymap[entry.key]; // need to do delete unfortunately
        if (entry.newer && entry.older) {
        // relink the older entry with the newer entry
            entry.older.newer = entry.newer;
            entry.newer.older = entry.older;
        }
        else if (entry.newer) {
            // remove the link to us
            entry.newer.older = undefined;
            // link the newer entry to head
            this.head = entry.newer;
        }
        else if (entry.older) {
            // remove the link to us
            entry.older.newer = undefined;
            // link the newer entry to head
            this.tail = entry.older;
        }
        else {// if(entry.older === undefined && entry.newer === undefined) {
            this.head = this.tail = undefined;
        }

        this.size--;
        return entry.value;
    };

    module.exports = LRUCache;
})

