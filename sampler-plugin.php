<?php
/*
   Plugin Name: Sampler Plugin
   Plugin URI: #
   Description: Quick plugin for testing this that and everything else
   Version: 1.0.0
   Author: JPG
   Author URI: #
   Text Domain: sampler-plugin
   License: GNU General Public License v3.0
   License URI: http://www.gnu.org/licenses/gpl-3.0.html
*/

class Sampler_Class {

	public function __construct() {
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'admin_menu', array( $this, 'add_menu_page' ) );
	}

	public function enqueue_scripts() {
		wp_enqueue_script( 'sampler-js', plugin_dir_url( __FILE__ ) . 'sampler.js' );
	}

	/**
	 * Register a custom menu page.
	 */
	function add_menu_page() {
		add_menu_page(
			__( 'My Custom Menu Page' ),
			'custom menu page',
			'manage_options',
			'sampler-plugin/menu-page.php'
		);
	}

}

new Sampler_Class();