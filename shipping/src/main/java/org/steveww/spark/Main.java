package org.steveww.spark;

import com.google.gson.Gson;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import spark.Spark;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Main {
    private static String CART_URL = null;
    private static Logger logger = LoggerFactory.getLogger(Main.class);

    public static void main(String[] args) {
        CART_URL = String.format("http://%s/shipping/", System.getenv("CART_ENDPOINT") != null ? System.getenv("CART_ENDPOINT") : "cart");

        Spark.port(8080);

        Spark.get("/health", (req, res) -> "OK");

        Spark.get("/count", (req, res) -> {
            final Count count = getCitiesCount();

            if (count == null) {
                res.status(500);
                return new ResponseError("Count error");
            }

            res.type("application/json");
            return new Gson().toJson(count);
        });

        Spark.get("/codes", (req, res) -> {
            final List<Code> codes = getCodes();

            if (codes == null) {
                res.status(500);
                return new ResponseError("Codes error");
            }

            res.type("application/json");
            return new Gson().toJson(codes);
        });

        Spark.get("/cities/:code", (req, res) -> {
            final String query = "select uuid, name from cities where country_code = '" + req.params(":code") + "' order by rand() limit 5";
            final List<City> cities = getCities(query);

            if (cities == null) {
                res.status(500);
                return new ResponseError("Cities error");
            }

            res.type("application/json");
            return new Gson().toJson(cities);
        });

        Spark.get("/match/:code/:text", (req, res) -> {
            final String query = "select uuid, name from cities " +
                    "where country_code = " + req.params(":code") +
                    " and city like " + req.params(":text") +
                    "order by name asc limit 10";
            final List<City> cities = getCities(query);

            if (cities == null) {
                res.status(500);
                return new ResponseError("Cities (:code :text) error");
            }

            res.type("application/json");
            return new Gson().toJson(cities);
        });

        Spark.get("/calc/:uuid", (req, res) -> {
            double homeLat = 51.164896;
            double homeLong = 7.068792;

            Location location = getLocation(req.params(":uuid"));
            Ship ship = new Ship();
            if (location != null) {
                long distance = location.getDistance(homeLat, homeLong);
                // charge 0.05 Euro per km
                // try to avoid rounding errors
                double cost = Math.rint(distance * 5) / 100.0;
                ship.setDistance(distance);
                ship.setCost(cost);
                res.header("Content-Type", "application/json");
            } else {
                res.status(400);
            }

            return new Gson().toJson(ship);
        });

        Spark.post("/confirm/:id", (req, res) -> {
            logger.info("confirm " + req.params(":id") + " - " + req.body());
            String cart = addToCart(req.params(":id"), req.body());
            logger.info("new cart " + cart);

            if (cart.equals("")) {
                res.status(404);
            } else {
                res.header("Content-Type", "application/json");
            }

            return cart;
        });

        logger.info("Ready");
    }

    private static Location getLocation(String uuid) {
        final String query = "select latitude, longitude from cities where uuid = " + uuid;

        Location location = null;
        try (Connection con = DataSource.getConnection();
             PreparedStatement pst = con.prepareStatement(query);
             ResultSet rs = pst.executeQuery()) {
            while (rs.next()) {
                location = new Location(
                        rs.getDouble("latitude"),
                        rs.getDouble("longitude")
                );
            }
        } catch (SQLException e) {
            logger.error(e.getLocalizedMessage());
        }
        return location;
    }

    private static Count getCitiesCount() {
        final String query = "select count(*) as count from cities";

        Count count = null;
        try (Connection con = DataSource.getConnection();
             PreparedStatement pst = con.prepareStatement(query);
             ResultSet rs = pst.executeQuery()) {
            count = new Count();
            while (rs.next()) {
                count.setCount(rs.getLong("count"));
            }
        } catch (SQLException e) {
            logger.error(e.getLocalizedMessage());
        }
        return count;
    }

    private static List<Code> getCodes() {
        final String query = "select code, name from codes order by name asc";
        List<Code> codes = null;
        try (Connection con = DataSource.getConnection();
             PreparedStatement pst = con.prepareStatement(query);
             ResultSet rs = pst.executeQuery()) {
            codes = new ArrayList<>();
            Code code;
            while (rs.next()) {
                code = new Code();
                code.setCode(rs.getString("code"));
                code.setName(rs.getString("name"));
                codes.add(code);
            }
        } catch (SQLException e) {
            logger.error(e.getLocalizedMessage());
        }
        return codes;
    }

    private static List<City> getCities(String query) {
        List<City> cities = null;
        try (Connection con = DataSource.getConnection();
             PreparedStatement pst = con.prepareStatement(query);
             ResultSet rs = pst.executeQuery()) {
            cities = new ArrayList<>();
            City city;
            while (rs.next()) {
                city = new City();
                city.setUuid(rs.getString("uuid"));
                city.setName(rs.getString("name"));
                cities.add(city);
            }
        } catch (SQLException e) {
            logger.error(e.getLocalizedMessage());
        }
        return cities;
    }

    private static String addToCart(String id, String data) {
        String responseString = null;

        CloseableHttpClient httpClient;

        try {
            HttpClientBuilder clientBuilder = HttpClientBuilder.create();
            RequestConfig.Builder requestConfigBuilder = RequestConfig.custom();
            requestConfigBuilder.setConnectTimeout(5000);
            requestConfigBuilder.setConnectionRequestTimeout(5000);

            clientBuilder.setDefaultRequestConfig(requestConfigBuilder.build());

            httpClient = clientBuilder.build();

            HttpPost postRequest = new HttpPost(CART_URL + id);
            StringEntity payload = new StringEntity(data);
            payload.setContentType("application/json");
            postRequest.setEntity(payload);

            HttpResponse res = httpClient.execute(postRequest);

            if (res.getStatusLine().getStatusCode() == 200) {
                HttpEntity entity = res.getEntity();
                responseString = EntityUtils.toString(entity, "UTF-8");
            } else {
                logger.warn("Failed with code: " + res.getStatusLine().getStatusCode());
            }
        } catch (Exception e) {
            logger.error("http client exception", e);
        }

        return responseString;
    }
}
