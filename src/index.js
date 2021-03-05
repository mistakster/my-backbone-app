import { Model, Collection, View } from "backbone";

const MovieView = View.extend({
    tagName: "div",

    initialize() {
        this.model.on("remove", () => {
            this.remove();
        });
    },

    render() {
        this.$el.html(`<p>${this.model.get("title")}</p>`);

        return this;
    }
});

const MovieCollectionView = View.extend({
    initialize() {
        this.collection.on("add", (movie) => {
            const movieView = new MovieView({
                model: movie
            });

            movieView.render();

            this.$el.append(movieView.$el);
        });
    }
});


const Movie = Model.extend({});

const MovieCollection = Collection.extend({
    model: Movie,

    url() {
        return "https://swapi.dev/api/films/"
    },

    parse(response) {
        return response
            .results
            .map(film => ({
                ...film,
                id: film.url.replace(/^.*\/(\d+)\/$/, "$1"),
            }));
    },

    initialize() {
    }
});

const favoriteMovies = new MovieCollection();

const favoriteMoviesView = new MovieCollectionView({
    el: "#root",
    collection: favoriteMovies
});

favoriteMoviesView.render();

favoriteMovies.fetch({
    success() {
        favoriteMovies.remove(["1", "3"]);
    }
});

