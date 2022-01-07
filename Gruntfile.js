module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-war');

    var taskConfig = {
        war: {
            target: {
                options: {
                    war_verbose: true,
                    war_dist_folder: 'warFile', // Folder path seperator added at runtime.
                    war_name: 'cobranzaWeb', // .war will be appended if omitted
                    webxml_welcome: 'index.html',
                    webxml_webapp_extras: ['<error-page><location>/index.html</location></error-page>'],
                    //redirect the errors pages to index.html
                    webxml_display_name: 'cobranzaWeb'
                },
                files: [{
                    expand: true,
                    cwd: 'dist', //the folder where the project is located
                    src: ['**'],
                    dest: ''
                }]
            }
        }
    };

    grunt.initConfig(taskConfig);
};