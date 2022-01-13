<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package esqueleto
 */

?>

	<footer id="colophon" class="site-footer">
		<div class="site-info">
			<a href="<?php echo esc_url( __( 'https://wordpress.org/', 'esqueleto' ) ); ?>">
				<?php
				/* translators: %s: CMS name, i.e. WordPress. */
				printf( esc_html__( 'Proudly powered by %s', 'esqueleto' ), 'WordPress' );
				?>
			</a>
			<span class="sep"> | </span>
				<?php
				printf(
					/* translators: 1: Theme name, 2: Theme author, 3: Original theme, 4: Original theme author. */
					esc_html__( 'Theme: %1$s by %2$s based on %3$s by %4$s.', 'esqueleto' ),
					'esqueleto',
					'<a href="https://github.com/fabio-blanco">F&aacute;bio Blanco</a>',
					'_s (Underscores)',
					'<a href="https://automattic.com/">Automattic</a>'
				);
				?>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
