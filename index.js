const fs = require('fs');
const path = require('path');

const find = {
    /**
     * Finds first directory that matches the target request. Direction of the searching: inside the tree. Returns 'null' if directory doesn't exists. 
     * @param {string} root Starting directory
     * @param {string} target Search directory. Case sensitive
     */
    dirSyncDown: (root, target) => {
        if (!root || !target)
            throw `'root' or 'target' dirs can't be null or undefined.`

        let result = null;

        let files = fs.readdirSync(root);
        for (const element of files) {
            if (result)
                break;

            let element_path = path.join(root, element);
            let stat = fs.statSync(element_path);
            if (!stat.isDirectory())
                continue;

            if (element === target)
                return element_path;
            else
                result = find.dirSyncDown(element_path, target);
        }

        return result;
    },

    /**
     * Finds first directory that matches the target request. Direction of the searching: outside the tree. Returns 'null' if directory doesn't exists. 
     * @param {string} root Starting directory
     * @param {string} target Search directory. Case sensitive
     */
    dirSyncUp: (root, target) => {
        if (!root || !target)
            throw `'root' or 'target' dirs can't be null or undefined.`

        if (root === '/')
            return null;

        let new_root = path.dirname(root);

        let files = fs.readdirSync(new_root).filter(element => element === target);
        if (files.length == 0)
            return find.dirSyncUp(new_root, target);
        else {
            for (const element of files) {
                let element_path = path.join(new_root, element);
                let stat = fs.statSync(element_path);
                if (!stat.isDirectory())
                    continue;
                else
                    return element_path;
            }
        }

        return find.dirSyncUp(new_root, target);
    }
};

module.exports = find;