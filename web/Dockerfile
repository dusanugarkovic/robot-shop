FROM nginx:1.13.8

EXPOSE 6712
EXPOSE 6713
EXPOSE 6714
EXPOSE 6715

ENV CATALOGUE_HOST=catalogue.robot-shop \
    USER_HOST=user.robot-shop \
    CART_HOST=cart.robot-shop \
    SHIPPING_HOST=shipping.robot-shop \
    PAYMENT_HOST=payment.robot-shop \
    RATINGS_HOST=ratings.robot-shop \
    EUM_HOST=eum-simulator \
    FRONTEND_HOST=eum-frontend \
    SHOP_HOST=eum-shop

COPY entrypoint.sh /root/
ENTRYPOINT ["/root/entrypoint.sh"]

COPY default.conf.template /etc/nginx/conf.d/default.conf.template
COPY static /usr/share/nginx/html

