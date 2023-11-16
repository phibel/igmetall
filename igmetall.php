<?php

/*
Plugin Name: Duagon Igmetall
Plugin URI: https://github.com/phibel/igmetall
Description: Provides a shortcode [igmetallCalculator] to create a calculator to convert the salary from duagon Germany GmbH into currently valid "IG Metall Tarifvertrag".
Version: 1.0
Author: phibel
Author URI: https://github.com/phibel/
License: GPLv2 or later
License URI: www.gnu.org/licenses/gpl-2.0.html
*/


function igmetallCalculator(): string {
	$dir = plugin_dir_url(__FILE__);
	return file_get_contents($dir.'template/calculator.html');
}

function igmetallTable(): string {
	$dir = plugin_dir_url(__FILE__);
	return file_get_contents($dir.'template/table.html');
}

function load_css(): void {
	$dir = plugin_dir_url(__FILE__);
	wp_enqueue_style( 'shortcode_igmetall_style_main', $dir.'css/main.css');
	wp_enqueue_style( 'shortcode_igmetall_style_performance_slider', $dir.'css/performance_slider.css');
	wp_enqueue_style( 'shortcode_igmetall_style_join_button', $dir.'css/join_button.css');
	wp_enqueue_style( 'shortcode_igmetall_style_calculator_layout', $dir.'css/calculator_layout.css');
	wp_enqueue_style( 'shortcode_igmetall_style_checkbox', $dir.'css/checkbox.css');
}

function load_script(): void {
	$dir = plugin_dir_url(__FILE__);
	wp_enqueue_script( 'shortcode_igmetall_script_main', $dir.'js/main.js');
}

add_action( 'wp_head', 'load_css' );
add_action( 'wp_head', 'load_script' );
add_shortcode('igmetallCalculator', 'igmetallCalculator');
add_shortcode('igmetallTable', 'igmetallTable');
