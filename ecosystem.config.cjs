/* eslint-disable no-undef */
module.exports = {
    apps: [
        {
            name: 'mhab_backend_test',
            port: '3404', // port in prod 
            exec_mode: 'fork',
            instances: '1',
            // Updated script to run npm run preview
            script: 'npm run preview'
        }
    ]
}